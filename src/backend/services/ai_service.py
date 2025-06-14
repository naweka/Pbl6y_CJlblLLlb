from models.file_info import FileInfo
import time
import matplotlib.pyplot as plt
import librosa
import librosa.display
import numpy as np
from io import BytesIO
from PIL import Image
from appconfig import WORKING_DIRECTORY
from matplotlib.patches import Rectangle
from repositories.file_info_repository import update_status_for_file
from repositories.model_settings_repository import (
    find_model_settings_by_file_id,
    find_default_model_settings,
)
from multiprocessing import Process
import torch
import torchaudio
import timm
import torch.nn.functional as F
from math import floor
import pandas as pd
import csv
import io
from services.helpers.limited_reversed_list import LimitedReversedList


# TODO подумать, как объединить с files_queue
processing_files = set()
"""Файлы, взятые в работу"""

files_queue: list[FileInfo] = []
"""Очередь на обработку"""

_device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_name = "swin_large_patch4_window7_224.ms_in22k"
ckpt = WORKING_DIRECTORY + "/packed_model/unpacked/swin_audio.pth"
classes = ["call", "noise"]
_model = timm.create_model(model_name, pretrained=False, num_classes=len(classes))

# Параметры
sample_rate = 22050  # Частота дискретизации


def print_log(*a):
    print(*a)


def preprocess_audio_segment(y, sr, duration):
    """Обрезает или дополняет аудиосигнал до указанной длительности."""
    if len(y) < sr * duration:
        y = np.pad(y, (0, int(sr * duration - len(y))), mode="constant")
    return y[: int(sr * duration)]


def extract_features(y, sr, n_mfcc=40):
    """Извлекает MFCC-признаки из аудиосигнала."""
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    return np.mean(mfcc.T, axis=0)


def process_file(current_file, merged_detections, filepath: str):
    # так как pyplot.savefig полностью занимает вычислительные можности и GIL
    # не дает нам возможности что-то с этим сделать, для сохранения файла было
    # принято волевое решение выполнять сохранение в дочернем процессе
    print_log(f"Создание спектрограммы для файла {current_file.id}...")
    ram = BytesIO()
    y, sr = librosa.load(current_file.audio_file_path, sr=16000)
    duration_sec = int(librosa.get_duration(y=y, sr=sr))
    D = librosa.stft(y, hop_length=64, win_length=256)
    S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)

    fig, ax = plt.subplots(nrows=1)
    plt.margins(0)
    fig.set_figwidth(duration_sec // 1)
    fig.set_figheight(2)
    ax.axis("off")

    librosa.display.specshow(
        S_db, sr=sr, hop_length=64, x_axis="time", y_axis="linear", ax=ax
    )

    # Добавление полупрозрачных прямоугольников
    for start, end in merged_detections:
        # Прямоугольник: начало, длина по оси x (временной масштаб), высота по оси y
        rect = Rectangle(
            (start, 0),  # Координаты левого нижнего угла
            end - start,  # Ширина
            ax.get_ylim()[1],  # Высота (заполняет весь спектр)
            linewidth=0,
            edgecolor=None,
            facecolor="white",
            alpha=0.46,  # Полупрозрачность
        )
        ax.add_patch(rect)

    fig.tight_layout()

    print_log(f"Сохранение спектрограммы для файла {current_file.name}...")
    plt.savefig(ram, format="png", bbox_inches="tight", dpi=300, pad_inches=0)
    ram.seek(0)
    im = Image.open(ram)
    im2 = im.convert("P", palette=Image.ADAPTIVE)
    im2.save(filepath, format="PNG")


def sliding_windows(wav, sr, win_sec, hop_sec):
    win_len = int(win_sec * sr)
    hop_len = int(hop_sec * sr)
    total = wav.shape[1]
    for start in range(0, total - win_len + 1, hop_len):
        yield start, wav[:, start : start + win_len]


def ai_event_loop():
    global files_queue
    while True:
        time.sleep(0.2)
        if len(files_queue) == 0:
            continue

        current_file: FileInfo = files_queue.pop(0)
        print_log(f"Найден файл {current_file.id}...")

        try:
            update_status_for_file(current_file.id, "ANALYZING")

            # region Прогоняем файл через модель

            print_log("Загрузка настроек модели...")
            model_settings = find_model_settings_by_file_id(current_file.id)
            if model_settings is None:
                model_settings = find_default_model_settings()

            print_log("Загрузка аудиофайла...")
            wav, sr = torchaudio.load(current_file.audio_file_path)
            # стерео в моно
            if wav.shape[0] == 2:
                wav = wav.mean(dim=0, keepdim=True)
            mel = torchaudio.transforms.MelSpectrogram(
                sample_rate=sr, n_mels=224, win_length=400, hop_length=160
            )

            results = []
            print_log("Обработка через модель...")
            for start, chunk in sliding_windows(
                wav, sr, model_settings.window_size, model_settings.window_step
            ):
                spec = mel(chunk).squeeze(0).log2().clamp(min=-10)
                # превращаем в тензор с 3 каналами
                spec = spec.unsqueeze(0).repeat(1, 3, 1, 1)
                # Изменяем размер спектрограммы до 224x224
                spec = F.interpolate(
                    spec, size=(224, 224), mode="bilinear", align_corners=False
                ).to(_device)
                with torch.no_grad():
                    prob = torch.softmax(_model(spec), dim=1)[0]
                score, cls = prob.max(0)
                # трешхолд уверенности именно самой модели
                # в теории, можно поменять, конечно, но потом всё равно будет ещё обработка
                if score.item() >= 0.7:
                    t0 = start / sr
                    t1 = (start + model_settings.window_size * sr) / sr
                    results.append((t0, t1, classes[cls], score.item()))

            csv_buffer = io.StringIO()
            csv_writer = csv.writer(csv_buffer)
            csv_writer.writerow(["start_s", "end_s", "label", "score"])
            csv_writer.writerows(results)
            csv_buffer.seek(0)
            results = pd.read_csv(csv_buffer)

            print_log("Постпроцессинг...")
            predicted_intervals = []
            win_width = model_settings.window_size
            win_step = model_settings.window_step
            offset = (model_settings.offset_bounds / 100.0) * win_width
            # "cut_when_at_least_one" / "cut_when_more_than_one" / "no_cut"
            ignore_noise_outliers = model_settings.ignore_noise_outliers
            # "insert_when_at_least_one" / "insert_when_more_than_one" / "no_insert"
            ignore_sound_outliers = model_settings.ignore_sound_outliers
            temp_interval = [-1, -1, []]
            steps_in_window = floor(win_width / win_step)
            # если мы двигаем окно слишком быстро, то и более
            # точные предикты нам будут не нужны
            if steps_in_window < 2:
                steps_in_window = 0

            llist = LimitedReversedList(steps_in_window)

            for i, r in enumerate(results.iterrows()):
                is_call = r[1][2] == "call"  # call or noise
                start = r[1][0]
                end = r[1][1]
                prob = r[1][3]
                # print(f'i {i}, is_call {is_call}, start {start}, end {end}, prob {prob}')

                llist.add(is_call)
                # пока мы не заполнили весь лист, работаем по упрощенной схеме "в лоб", ну или
                # если двигаем окно слишком быстро, то и смысла действовать по-умному у нас нет
                if steps_in_window == 0 or i < steps_in_window:
                    if is_call:
                        if temp_interval == [-1, -1, []]:
                            temp_interval = [start + offset, end - offset, [prob]]
                            continue
                        temp_interval[1] = end - offset
                        temp_interval[2].append(prob)
                    else:
                        if temp_interval != [-1, -1, []]:
                            predicted_intervals.append(temp_interval)
                            temp_interval = [-1, -1, []]
                    continue

                # работаем по-умному
                # будем двигать окно очень медленно, чтобы собрать как можно больше
                # предиктов, но в этом случае начинают появлять шумы посреди звука и наоборт
                # данная система призвана обрабатывать такие случаи

                # если был шум и щас шум, значит, ничего нового не происходит
                # if all([x == False for x in llist()]):
                if all([not x for x in llist()]):
                    if temp_interval != [-1, -1, []]:
                        predicted_intervals.append(temp_interval)
                        temp_interval = [-1, -1, []]
                    continue

                # если был звук и щас звук, просто обновляем интервал
                # if all([x == True for x in llist()]):
                if all([x for x in llist()]):
                    if temp_interval == [-1, -1, []]:
                        temp_interval = [start + offset, end - offset, [prob]]
                        continue
                    temp_interval[1] = end - offset
                    temp_interval[2].append(prob)
                    continue

                # если нам попался звук, но ранее был шум, то возможно это вброс звука,
                # для принятия решения смотрим на ignore_sound_outliers
                # if llist()[0] == True and llist()[-1] == False:
                if llist()[0] and not llist()[-1]:
                    # игнорим вбросы звука и будем ждать пока llist полностью
                    # заполнится предиктом звука
                    if ignore_sound_outliers == "no_insert":
                        continue
                    # если щас был звук и прошлый предикт тоже был звук,
                    # то походу надо бы это детектить уже как звук
                    if ignore_sound_outliers == "insert_when_more_than_one":
                        # if llist()[0] == True and llist()[1] == True:
                        if llist()[0] and not llist()[1]:
                            if temp_interval == [-1, -1, []]:
                                temp_interval = [start + offset, end - offset, [prob]]
                                continue
                            temp_interval[1] = end - offset
                            temp_interval[2].append(prob)
                            continue
                        else:
                            continue
                    # добавляем в интервал в любом случае
                    if ignore_sound_outliers == "insert_when_at_least_one":
                        if temp_interval == [-1, -1, []]:
                            temp_interval = [start + offset, end - offset, [prob]]
                            continue
                        temp_interval[1] = end - offset
                        temp_interval[2].append(prob)
                        continue
                    raise Exception("Что-то пошло не так 1")

                # если нам попался шум, но ранее был звук, то возможно это вброс шума,
                # для принятия решения смотрим на ignore_noise_outliers
                # if llist()[0] == False and llist()[-1] == True:
                if not llist()[0] and llist()[-1]:
                    # игнорим вбросы шума и будем ждать пока llist полностью
                    # заполнится предиктом шума
                    if ignore_noise_outliers == "no_cut":
                        continue
                    # если щас был шум и прошлый предикт тоже был шум,
                    # то походу надо бы это детектить уже как шум и резать
                    if ignore_noise_outliers == "cut_when_more_than_one":
                        # if llist()[0] == False and llist()[1] == False:
                        if not llist()[0] and not llist()[1]:
                            if temp_interval != [-1, -1, []]:
                                predicted_intervals.append(temp_interval)
                                temp_interval = [-1, -1, []]
                            continue
                        else:
                            continue
                    # режем в любом случае
                    if ignore_noise_outliers == "cut_when_at_least_one":
                        if temp_interval != [-1, -1, []]:
                            predicted_intervals.append(temp_interval)
                            temp_interval = [-1, -1, []]
                        continue
                    raise Exception("Что-то пошло не так 2")
            if temp_interval != [-1, -1, []]:
                predicted_intervals.append(temp_interval)
                temp_interval = [-1, -1, []]

            _predicted_intervals = predicted_intervals
            predicted_intervals = []

            for s, e, p in _predicted_intervals:
                mean_prob = sum(p) / len(p)
                if (
                    mean_prob > model_settings.confidence_limit
                    and e - s > model_settings.min_sound_length
                ):
                    predicted_intervals.append((s, e))
                    # print(f'{s:.2f}', '\t', f'{e:.2f}', '\t', mean_prob)

            merged_detections = predicted_intervals

            # endregion Прогоняем файл через модель

            # region Генерируем спектрограмму

            filepath = (
                WORKING_DIRECTORY + f"/server_data/spectrograms/{current_file.id}.png"
            )
            # так как pyplot.savefig полностью занимает вычислительные можности и GIL
            # не дает нам возможности что-то с этим сделать, для сохранения файла было
            # принято решение выполнять сохранение в дочернем процессе
            p = Process(
                target=process_file,
                args=(
                    current_file,
                    merged_detections,
                    filepath,
                ),
            )
            p.start()
            p.join()
            print_log(f"Успешно создана спектрограмма для файла {current_file.id}!")

            # endregion Генерируем спектрограмму

            # region Создание csv с предиктом

            csv_text = "start_second,end_second\n"
            for pair in merged_detections:
                csv_text += f"{pair[0]},{pair[1]}\n"
            filepath = (
                WORKING_DIRECTORY + f"/server_data/predicted_data/{current_file.id}.csv"
            )
            open(filepath, "w").write(csv_text)
            print_log(f"Успешно создан CSV файл для {current_file.id}!")

            # endregion Создание csv с предиктом

        except Exception:
            import traceback

            traceback.print_exc()
        finally:
            processing_files.remove(current_file.id)
            update_status_for_file(current_file.id, "READY")
