import random

# Label mapping
LABELS_MAP = {
    0: "Normal",
    1: "FOMO ⚠",
    2: "Relaxed",
    3: "Focused"
}

def get_label_name(label):
    return LABELS_MAP.get(label, "Unknown")


def generate_sample(label):
    """Generate synthetic EEG sample"""

    if label == 1:  # FOMO
        return [
            random.uniform(5,10),
            random.uniform(20,35),
            random.uniform(4,8),
            random.uniform(5,10),
            random.uniform(70,100),
            random.uniform(3,6)
        ]

    elif label == 2:  # Relaxed
        return [
            random.uniform(10,20),
            random.uniform(5,15),
            random.uniform(6,10),
            random.uniform(2,5),
            random.uniform(20,50),
            random.uniform(0,1)
        ]

    elif label == 3:  # Focused
        return [
            random.uniform(8,14),
            random.uniform(15,25),
            random.uniform(5,9),
            random.uniform(4,8),
            random.uniform(60,90),
            random.uniform(0,1)
        ]

    else:  # Normal
        return [
            random.uniform(8,12),
            random.uniform(10,18),
            random.uniform(5,8),
            random.uniform(3,6),
            random.uniform(40,70),
            random.uniform(1,3)
        ]