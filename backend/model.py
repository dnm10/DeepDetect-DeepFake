import torch
import torch.nn as nn
from torchvision import models


def load_model(model_path, device):

    # Initialize ResNet18
    model = models.resnet18(weights=None)

    # Same architecture used during training
    model.fc = nn.Sequential(
        nn.Linear(model.fc.in_features, 256),
        nn.ReLU(),
        nn.Dropout(0.4),
        nn.Linear(256, 3)   # Real / Fake / Synthetic
    )

    # Move model to device first
    model = model.to(device)

    # Load trained weights safely
    state_dict = torch.load(
        model_path,
        map_location=device,
        weights_only=True
    )

    model.load_state_dict(state_dict)

    # Set evaluation mode
    model.eval()

    return model