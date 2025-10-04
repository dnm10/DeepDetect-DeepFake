# backend/model.py
import torch
import torch.nn as nn
from torchvision import models

def load_model(model_path, device):
    model = models.resnet18(weights=None)
    model.fc = nn.Linear(model.fc.in_features, 2)  # Binary: real or fake
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    return model
