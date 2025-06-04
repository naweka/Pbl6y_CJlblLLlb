import numpy as np
from tqdm import tqdm

def calculate_iou(interval_a, interval_b):
    start_a, end_a = interval_a
    start_b, end_b = interval_b
    
    intersection = max(0, min(end_a, end_b) - max(start_a, start_b))
    union = (end_a - start_a) + (end_b - start_b) - intersection
    return intersection / union if union > 0 else 0.0
    
def calculate_ap(true_segments, pred_segments, iou_thresholds):
    aps = []
    
    for thresh in iou_thresholds:
        # Сопоставление предсказаний с истинными интервалами
        matched_true = set()
        tp = np.zeros(len(pred_segments))
        fp = np.zeros(len(pred_segments))
        
        for i, pred in enumerate(pred_segments):
            best_iou = 0.0
            best_idx = -1
            for j, true in enumerate(true_segments):
                if j in matched_true:
                    continue
                iou = calculate_iou(pred, true)
                if iou > best_iou:
                    best_iou = iou
                    best_idx = j
            
            if best_iou >= thresh:
                matched_true.add(best_idx)
                tp[i] = 1
            else:
                fp[i] = 1

        # Рассчитываем precision-recall кривую
        tp_cumsum = np.cumsum(tp)
        fp_cumsum = np.cumsum(fp)
        
        recalls = tp_cumsum / len(true_segments)
        precisions = tp_cumsum / (tp_cumsum + fp_cumsum + 1e-12)
        
        # Интерполяция precision для 101 точки
        interp_precision = np.zeros(101)
        for r in range(101):
            precision_vals = precisions[recalls >= r/100]
            interp_precision[r] = max(precision_vals) if len(precision_vals) > 0 else 0
        
        # Вычисляем AP как среднее значение precision
        ap = np.mean(interp_precision)
        aps.append(ap)
    
    return aps

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
        'AP50': calculate_ap(true_segments, pred_segments, [0.5])[0],
        'AP75': calculate_ap(true_segments, pred_segments, [0.75])[0],
        'AP50-95': np.mean(calculate_ap(true_segments, pred_segments, np.arange(0.5, 1.0, 0.05)))
    }

def bootstrap_confidence_intervals(true_segments, pred_segments, iou_threshold=0.5,
                                  n_bootstrap=1000, confidence_level=0.95):
    # Модифицируем для новых метрик
    n_true = len(true_segments)
    n_pred = len(pred_segments)
    
    metrics_samples = {
        'Precision': [],
        'Recall': [],
        'F1-score': [],
        'AP50': [],
        'AP75': [],
        'AP50-95': []
    }
    
    for _ in tqdm(range(n_bootstrap), desc="Bootstrapping"):
        true_bootstrap = [true_segments[i] for i in np.random.choice(n_true, n_true, replace=True)]
        pred_bootstrap = [pred_segments[i] for i in np.random.choice(n_pred, n_pred, replace=True)]
        
        metrics = evaluate_metrics(true_bootstrap, pred_bootstrap, iou_threshold)
        for k in metrics_samples:
            metrics_samples[k].append(metrics[k])
    
    # Вычисление квантилей для всех метрик
    alpha = (1 - confidence_level) / 2
    ci = {}
    
    for metric, samples in metrics_samples.items():
        ci[metric + "_CI"] = np.percentile(samples, [alpha*100, (1-alpha)*100])
    
    return ci