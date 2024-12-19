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


        # ---- Генерируем спектрограмму

        if current_file.spectrogram_file_path is None:
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

            fig.colorbar(img, ax=ax, format="%+2.f dB")
            fig.tight_layout()

            print_log(f'Сохранение спектрограммы для файла {current_file.alias_name}...')
            ram = BytesIO()
            plt.savefig(ram, format='png', bbox_inches='tight', dpi=300)
            ram.seek(0)
            im = Image.open(ram)
            im2 = im.convert('P', palette=Image.ADAPTIVE)
            ram = BytesIO()
            filepath = WORKING_DIRECTORY+f'/server_data/spectrograms/{current_file.alias_name}.png'
            ram.seek(0)
            im2.save(filepath, format='PNG')
            # path_to_fake = WORKING_DIRECTORY +'/fake_spectro.png'
            # shutil.copyfile(path_to_fake, filepath)
            print_log(f'Успешно создана спектрограмма для файла {current_file.alias_name}!')
            current_file.audio_file_path = filepath

