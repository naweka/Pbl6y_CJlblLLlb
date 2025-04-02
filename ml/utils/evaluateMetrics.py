import numpy as np
from tqdm import tqdm

def calculate_iou(interval_a, interval_b):
    start_a, end_a = interval_a
    start_b, end_b = interval_b
    
    intersection = max(0, min(end_a, end_b) - max(start_a, start_b))
    union = (end_a - start_a) + (end_b - start_b) - intersection
    return intersection / union if union > 0 else 0.0
    

def evaluate_metrics(true_segments, pred_segments, iou_threshold=0.5): #Важный коэф надо покрутить
    true_positives = 0
    matched_true_indices = set()
    
    for pred in pred_segments:
        best_iou = 0.0
        best_true_idx = -1
        
        for i, true in enumerate(true_segments):
            if i in matched_true_indices:
                continue
                
            iou = calculate_iou(pred, true)
            if iou > best_iou:
                best_iou = iou
                best_true_idx = i
                
        if best_iou >= iou_threshold:
            true_positives += 1
            matched_true_indices.add(best_true_idx)
    
    false_positives = len(pred_segments) - true_positives
    false_negatives = len(true_segments) - true_positives
    
    precision = true_positives / (true_positives + false_positives) if (true_positives + false_positives) > 0 else 0.0
    recall = true_positives / (true_positives + false_negatives) if (true_positives + false_negatives) > 0 else 0.0
    f1_score = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0.0
    
    return {
        'Precision': precision,
        'Recall': recall,
        'F1-score': f1_score,
    }

def bootstrap_confidence_intervals(true_segments, pred_segments, iou_threshold=0.5, 
                                 n_bootstrap=1000, confidence_level=0.95):
    """Вычисляет доверительные интервалы метрик с помощью бутстрепа.
        true_segments: Эталонные интервалы
        pred_segments: Предсказанные интервалы
        iou_threshold: Порог IoU
        n_bootstrap: Количество бутстреп-выборок (ставьте поменьше для большой выборки)
        confidence_level: Уровень доверия (0.95 для 95%)
    """
    # Исходные метрики

    # Бутстреп-выборки
    n_true = len(true_segments)
    n_pred = len(pred_segments)
    
    precision_samples = []
    recall_samples = []
    f1_samples = []
    
    for _ in tqdm(range(n_bootstrap), desc="Bootstrapping"):
        # Генерация бутстреп-выборок с повторением
        true_bootstrap = [true_segments[i] for i in np.random.choice(n_true, n_true, replace=True)]
        pred_bootstrap = [pred_segments[i] for i in np.random.choice(n_pred, n_pred, replace=True)]
        
        # Вычисление метрик для выборки
        metrics = evaluate_metrics(true_bootstrap, pred_bootstrap, iou_threshold)
        precision_samples.append(metrics['Precision'])
        recall_samples.append(metrics['Recall'])
        f1_samples.append(metrics['F1-score'])
    
    # Вычисление квантилей
    alpha = (1 - confidence_level) / 2
    ci_low = alpha * 100
    ci_high = (1 - alpha) * 100
    
    def get_ci(samples):
        return np.percentile(samples, [ci_low, ci_high])
    
    return {
        'Precision_CI': get_ci(precision_samples),
        'Recall_CI': get_ci(recall_samples),
        'F1_CI': get_ci(f1_samples),
    }