from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from PIL import Image
import io
import torch
import torch.nn.functional as F
import numpy as np
import time
import json
import os

from model import load_model
from predict_utils import (
    generate_gradcam,
    generate_fft,
    generate_face_heatmap,
    generate_probability_chart,
    generate_confidence_gauge
)

app = FastAPI()

# CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load trained model
model = load_model("best_resnet_model_3class.pth", device)
model.eval()

# Image preprocessing (must match training)
transform = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485,0.456,0.406],
        std=[0.229,0.224,0.225]
    )
])

# ================================
# FAST DETECTION ENDPOINT
# ================================
@app.post("/predict/")
async def predict_image(file: UploadFile = File(...)):

    try:

        start = time.time()

        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

        width, height = image.size

        img_tensor = transform(image).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(img_tensor)
            probs = F.softmax(output, dim=1).cpu().numpy()[0]

        print("Model probabilities:", probs)

        # Model class order:
        # 0 → fake
        # 1 → real
        # 2 → synthetic

        fake_prob = float(probs[0]) + float(probs[2])
        real_prob = float(probs[1])

        prediction = "Real" if real_prob > fake_prob else "Fake"
        confidence = max(real_prob, fake_prob)

        real_prob = round(real_prob * 100, 2)
        fake_prob = round(fake_prob * 100, 2)
        confidence = round(confidence * 100, 2)

        inference_time = round(time.time() - start, 3)

        return {
            "prediction": prediction,
            "confidence": confidence,
            "fake_prob": fake_prob,
            "real_prob": real_prob,
            "width": width,
            "height": height,
            "model": "ResNet18",
            "inference_time": inference_time
        }

    except Exception as e:
        return {"error": str(e)}


# ================================
# REPORT ANALYSIS (FOR PDF)
# ================================
@app.post("/generate-report/")
async def generate_report(file: UploadFile = File(...)):

    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    img_array = np.array(image)
    img_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        output = model(img_tensor)
        probs = F.softmax(output, dim=1).cpu().numpy()[0]

    # Convert 3-class → binary
    fake_prob = float(probs[0]) + float(probs[2])
    real_prob = float(probs[1])

    prediction = "Real" if real_prob > fake_prob else "Fake"
    confidence = max(real_prob, fake_prob)

    real_prob = round(real_prob * 100, 2)
    fake_prob = round(fake_prob * 100, 2)
    confidence = round(confidence * 100, 2)

    # Generate visual explanations
    gradcam = generate_gradcam(model, img_tensor, img_array)
    fft = generate_fft(img_array)
    face_heatmap = generate_face_heatmap(img_array)

    prob_chart = generate_probability_chart(real_prob, fake_prob)
    confidence_gauge = generate_confidence_gauge(confidence)

    return {
        "prediction": prediction,
        "confidence": confidence,
        "real_prob": real_prob,
        "fake_prob": fake_prob,
        "gradcam": gradcam,
        "fft": fft,
        "face_heatmap": face_heatmap,
        "prob_chart": prob_chart,
        "confidence_gauge": confidence_gauge
    }

@app.get("/comparison")
def get_comparison():

    file_path = os.path.join(os.path.dirname(__file__), "results.json")

    with open(file_path, "r") as f:
        data = json.load(f)

    return data