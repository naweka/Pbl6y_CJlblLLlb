import argparse
from pathlib import Path
import torch
import torchaudio
import timm
import csv
import torch.nn.functional as F
import soundfile as sf


def sliding_windows(wav, sr, win_sec, hop_sec):
    win_len = int(win_sec * sr)
    hop_len = int(hop_sec * sr)
    total = wav.shape[1]
    for start in range(0, total - win_len + 1, hop_len):
        yield start, wav[:, start:start+win_len]

def inference(args):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Загрузка модели
    model = timm.create_model(args.model_name, pretrained=False, num_classes=len(args.classes))
    model.load_state_dict(torch.load(args.ckpt, map_location=device))
    model.to(device).eval()

    # Проверка файла
    input_path = Path(args.input).resolve()
    if not input_path.exists():
        raise FileNotFoundError(f"Файл {input_path} не найден.")

    torchaudio.set_audio_backend("soundfile")

    # Загрузка аудио
    wav_np, sr = sf.read(str(input_path))
    if wav_np.ndim > 1:
        wav_np = wav_np.mean(axis=1)  # преобразование в моно
    wav = torch.tensor(wav_np, dtype=torch.float32).unsqueeze(0)  # [1, N]

    # Мел-спектрограмма
    mel_transform = torchaudio.transforms.MelSpectrogram(
        sample_rate=sr,
        n_mels=args.n_mels,
        win_length=args.win_length,
        hop_length=args.hop_length
    )

    results = []

    for start, chunk in sliding_windows(wav, sr, args.win_sec, args.hop_sec):
        with torch.no_grad():
            spec = mel_transform(chunk).squeeze(0)  # [n_mels, time]
            spec = torch.clamp(torch.log2(spec + 1e-6), min=-10)

            # Преобразуем в [1, 3, H, W]
            spec = spec.unsqueeze(0).repeat(1, 3, 1, 1)

            # Изменение размера
            spec = F.interpolate(spec, size=(224, 224), mode='bilinear', align_corners=False).to(device)

            # Предсказание
            prob = torch.softmax(model(spec), dim=1)[0]
            score, cls = prob.max(0)

            if score.item() >= args.thr:
                t0 = start / sr
                t1 = (start + int(args.win_sec * sr)) / sr
                results.append((t0, t1, args.classes[cls], score.item()))

    # Сохранение результатов
    with open(args.output, "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["start_s", "end_s", "label", "score"])
        writer.writerows(results)

    print(f"[✓] Результаты сохранены в: {args.output}")

if __name__ == "__main__":
    # p = argparse.ArgumentParser()
    # p.add_argument("--input", type=str, required=True, help="путь к большому .wav")
    # p.add_argument("--ckpt", type=str, required=True, help="файл модели .pth")
    # p.add_argument("--output", type=str, default="detections.csv")
    # p.add_argument("--classes", nargs=2, default=["call", "noise"])
    # p.add_argument("--win_sec", type=float, default=0.5, help="длина окна в секундах")
    # p.add_argument("--hop_sec", type=float, default=0.1, help="шаг окна в секундах")
    # p.add_argument("--thr", type=float, default=0.7, help="порог вероятности")
    # p.add_argument("--n_mels", type=int, default=224)
    # p.add_argument("--win_length", type=int, default=400)
    # p.add_argument("--hop_length", type=int, default=160)
    # p.add_argument("--model_name", type=str, default="swin_large_patch4_window7_224.ms_in22k")
    # args = p.parse_args() 
    #inference(args)
    
    wav_dir = Path("../dataset/test_dataset_by_Kirill")
    wav_files = list(wav_dir.glob("*.wav"))
    print(f"Найдено {len(wav_files)} файлов .wav в директории {wav_dir}")
    
    for wav_path in wav_files:
        file_stem = wav_path.stem  # имя файла без .wav
        output_filename = f"pred_{file_stem}.csv"

        args = argparse.Namespace(
            input=str(wav_path),
            ckpt="swin_audio.pth",
            output=output_filename,
            classes=["call", "noise"],
            win_sec=0.5,
            hop_sec=0.1,
            thr=0.7,
            n_mels=224,
            win_length=400,
            hop_length=160,
            model_name="swin_large_patch4_window7_224.ms_in22k"
        )

        print(f"Обработка файла: {wav_path.name} -> {output_filename}")
        inference(args)
    
    
    

# Перепиши вызов на умный аргумент
# python sn_pred.py --input /path/to/input.wav --ckpt /path/to/model.pth --output /path/to/output.csv --classes call noise --win_sec 0.5 --hop_sec 0.1 --thr 0.7