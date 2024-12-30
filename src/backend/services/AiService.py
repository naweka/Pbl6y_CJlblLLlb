from typing import List
from models.FileInfo import FileInfo
import time
import matplotlib.pyplot as plt
import librosa
import librosa.display
import numpy as np
from io import BytesIO
import shutil
from PIL import Image
from appconfig import WORKING_DIRECTORY
import tensorflow as tf
from matplotlib.patches import Rectangle
from repositories.card_repository import find_card_by_file_id, update_status_for_card

model = tf.keras.models.load_model(WORKING_DIRECTORY + "/marine_sound_classifier_v2.h5")

# Параметры
segment_duration = 1.0  # Длительность сегмента в секундах
sample_rate = 22050  # Частота дискретизации
step_size = 0.33  # Шаг сканирования в секундах


def preprocess_audio_segment(y, sr, duration):
    """Обрезает или дополняет аудиосигнал до указанной длительности."""
    if len(y) < sr * duration:
        y = np.pad(y, (0, int(sr * duration - len(y))), mode='constant')
    return y[:int(sr * duration)]


def extract_features(y, sr, n_mfcc=40):
    """Извлекает MFCC-признаки из аудиосигнала."""
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    return np.mean(mfcc.T, axis=0)


files_queue:List[FileInfo] = []


def print_log(*a):
    print(*a)


def ml_event_loop():
    global files_queue
    while True:
        time.sleep(0.2)

        if len(files_queue) == 0:
            continue

        current_file:FileInfo = files_queue.pop(0)
        print_log(f'Найден файл {current_file.alias_name}...')


        card_id = find_card_by_file_id(current_file.id).id
        update_status_for_card(card_id, 'ANALYZING')

        #region Прогоняем файл через модель

        y_full, sr = librosa.load(current_file.audio_file_path, sr=sample_rate)

        # Разделение на сегменты и анализ
        segment_start = 0
        segment_end = segment_duration
        detections = []

        while segment_start < len(y_full) / sr:
            print('Progress:', 100.0 * (segment_start / (len(y_full) / sr)), '%')
            start_sample = int(segment_start * sr)
            end_sample = int(segment_end * sr)
            segment = y_full[start_sample:end_sample]
            
            segment = preprocess_audio_segment(segment, sr, duration=segment_duration)
            
            features = extract_features(segment, sr).reshape(1, -1)
            prediction = model.predict(features,verbose = 0)
            
            # print(prediction[0][0])
            if prediction[0][0] > 0.97:  # Порог для классификации
                detections.append((segment_start, min(segment_end, len(y_full) / sr)))
            
            segment_start += step_size
            segment_end += step_size

        # Объединение пересекающихся интервалов
        merged_detections = []
        for start, end in detections:
            if merged_detections and start <= merged_detections[-1][1]:
                # Обновляем конец предыдущего интервала
                merged_detections[-1] = (merged_detections[-1][0], max(merged_detections[-1][1], end))
            else:
                # Добавляем новый интервал
                merged_detections.append((start, end))


        # print("Звуки морских животных найдены в следующих интервалах (в секундах):")
        # for start, end in merged_detections:
        #     print(f"Начало: {start:.2f} с, Конец: {end:.2f} с")
        #endregion Прогоняем файл через модель

        #region Генерируем спектрограмму
        
        print_log(f'Создание спектрограммы для файла {current_file.alias_name}...')
        y, sr = librosa.load(current_file.audio_file_path, sr=16000)
        duration_sec = int(librosa.get_duration(y=y, sr=sr))
        D = librosa.stft(y, hop_length=64, win_length=256)
        S_db = librosa.amplitude_to_db(np.abs(D), ref=np.max)

        fig, ax = plt.subplots(nrows=1)
        plt.margins(0)
        fig.set_figwidth(duration_sec // 4)
        fig.set_figheight(2)
        ax.axis('off')

        img = librosa.display.specshow(S_db,
                                    sr=sr,
                                    hop_length=64,
                                    x_axis='time',
                                    y_axis='linear',
                                    ax=ax)

        # fig.colorbar(img, ax=ax, format="%+2.f dB")
        # fig.tight_layout()

        # Добавление полупрозрачных прямоугольников
        for start, end in merged_detections:
            # Прямоугольник: начало, длина по оси x (временной масштаб), высота по оси y
            rect = Rectangle(
                (start, 0),  # Координаты левого нижнего угла
                end - start,  # Ширина
                ax.get_ylim()[1],  # Высота (заполняет весь спектр)
                linewidth=0,
                edgecolor=None,
                facecolor='white',
                alpha=0.46  # Полупрозрачность
            )
            ax.add_patch(rect)

        fig.tight_layout()

        print_log(f'Сохранение спектрограммы для файла {current_file.alias_name}...')
        filepath = WORKING_DIRECTORY+f'/server_data/spectrograms/{current_file.alias_name}.png'
        ram = BytesIO()
        plt.savefig(ram, format='png', bbox_inches='tight', dpi=300, pad_inches=0)
        ram.seek(0)
        im = Image.open(ram)
        im2 = im.convert('P', palette=Image.ADAPTIVE)
        im2.save(filepath, format='PNG')
        print_log(f'Успешно создана спектрограмма для файла {current_file.alias_name}!')


        #endregion Генерируем спектрограмму

        #region Создание csv с предиктом

        csv_text = 'start_second,end_second'
        for pair in merged_detections:
            csv_text += f'{pair[0]},{pair[1]}\n'
        filepath = WORKING_DIRECTORY+f'/server_data/predicted_data/{current_file.alias_name}.csv'
        open(filepath, 'w').write(csv_text)
        print_log(f'Успешно создан CSV файл для {current_file.alias_name}!')

        #endregion Создание csv с предиктом

        update_status_for_card(card_id, 'READY')