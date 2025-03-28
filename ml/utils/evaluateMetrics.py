import numpy as np

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