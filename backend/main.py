from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from PIL import Image
import io
import torch
import torch.nn.functional as F
import numpy as np
import time

from model import load_model
from predict_utils import (
    generate_gradcam,
    generate_fft,
    generate_face_heatmap,
    generate_probability_chart,
    generate_confidence_gauge
)

app = FastAPI()

# Allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Device selection
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load trained model
model = load_model("best_resnet_model_3class.pth", device)

# Image transform
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor()
])

# Class labels (same order used during training)
CLASS_NAMES = ["Real", "Fake", "Synthetic"]


# =====================================
# FAST PREDICTION ENDPOINT
# =====================================
@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):

    start = time.time()

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    width, height = image.size

    img_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)
        probs = F.softmax(output, dim=1).cpu().numpy()[0]

    pred_idx = int(np.argmax(probs))
    label = CLASS_NAMES[pred_idx]

    # Map Synthetic → Fake
    if label == "Synthetic":
        label = "Fake"

    confidence = float(probs[pred_idx]) * 100
    confidence = round(confidence, 2)

    real_prob = round(float(probs[0]) * 100, 2)
    fake_prob = round(float(probs[1]) * 100, 2)

    inference_time = round(time.time() - start, 3)

    return {
        "prediction": label,
        "confidence": confidence,
        "fake_prob": fake_prob,
        "real_prob": real_prob,
        "width": width,
        "height": height,
        "model": "ResNet18",
        "inference_time": inference_time
    }


# =====================================
# REPORT GENERATION ENDPOINT
# =====================================
@app.post("/generate-report/")
async def generate_report(file: UploadFile = File(...)):

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    img_array = np.array(image)

    img_tensor = transform(image).unsqueeze(0).to(device)

    # Model inference for probabilities
    with torch.no_grad():
        output = model(img_tensor)
        probs = F.softmax(output, dim=1).cpu().numpy()[0]

    real_prob = round(float(probs[0]) * 100, 2)
    fake_prob = round(float(probs[1]) * 100, 2)
    confidence = max(real_prob, fake_prob)

    # Generate analysis images
    gradcam = generate_gradcam(model, img_tensor, img_array)
    fft = generate_fft(img_array)
    face_heatmap = generate_face_heatmap(img_array)

    prob_chart = generate_probability_chart(real_prob, fake_prob)
    confidence_gauge = generate_confidence_gauge(confidence)

    return {
        "gradcam": gradcam,
        "fft": fft,
        "face_heatmap": face_heatmap,
        "prob_chart": prob_chart,
        "confidence_gauge": confidence_gauge
    }