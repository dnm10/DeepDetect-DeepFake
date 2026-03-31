import numpy as np
import cv2
import base64
import matplotlib.pyplot as plt
from io import BytesIO

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image

import os
import shutil
from PIL import Image
import torch
import torch.nn.functional as F


# =========================
# Convert image → Base64
# =========================
def encode_image(img):

    _, buffer = cv2.imencode(".png", img)

    return base64.b64encode(buffer).decode("utf-8")


# =========================
# GradCAM
# =========================
def generate_gradcam(model, input_tensor, img_array):

    target_layer = model.layer4[-1]

    cam = GradCAM(model=model, target_layers=[target_layer])

    # Generate heatmap
    grayscale_cam = cam(input_tensor)[0]

    # Resize original image to match model input
    rgb_img = cv2.resize(img_array, (224, 224))
    rgb_img = rgb_img.astype(np.float32) / 255.0

    # Overlay heatmap
    visualization = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    # Convert to BGR for OpenCV encoding
    visualization = cv2.cvtColor(visualization, cv2.COLOR_RGB2BGR)

    return encode_image(visualization)


# =========================
# Face Heatmap
# =========================
def generate_face_heatmap(image):

    # Ensure BGR format
    if image.shape[2] == 3:
        img_bgr = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    else:
        img_bgr = image

    heatmap = cv2.GaussianBlur(img_bgr, (55, 55), 0)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(img_bgr, 0.6, heatmap, 0.4, 0)

    return encode_image(overlay)


# =========================
# FFT Spectrum
# =========================
def generate_fft(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    f = np.fft.fft2(gray)

    fshift = np.fft.fftshift(f)

    magnitude = np.log(np.abs(fshift) + 1)

    magnitude = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)

    magnitude = magnitude.astype(np.uint8)

    magnitude = cv2.applyColorMap(magnitude, cv2.COLORMAP_JET)

    return encode_image(magnitude)


# =========================
# Probability Chart
# =========================
def generate_probability_chart(real_prob, fake_prob):

    labels = ["Real", "Fake"]
    values = [real_prob, fake_prob]

    fig, ax = plt.subplots(figsize=(4,3))

    ax.bar(labels, values, color=["green", "red"])

    ax.set_ylabel("Probability %")
    ax.set_title("Prediction Probability")

    buf = BytesIO()

    plt.tight_layout()
    plt.savefig(buf, format="png", bbox_inches="tight", dpi=150)
    plt.close()

    buf.seek(0)

    return base64.b64encode(buf.read()).decode("utf-8")


# =========================
# Confidence Gauge
# =========================
def generate_confidence_gauge(confidence):

    import matplotlib.pyplot as plt
    import base64
    from io import BytesIO

    fig, ax = plt.subplots(figsize=(6,2))

    ax.barh(["Confidence"], [confidence], color="blue")

    ax.set_xlim(0,100)

    ax.set_xlabel("Confidence (%)")

    ax.set_title(f"Model Confidence: {confidence:.2f}%")

    buf = BytesIO()

    plt.tight_layout()
    plt.savefig(buf, format="png", dpi=150)
    plt.close()

    buf.seek(0)

    return base64.b64encode(buf.read()).decode("utf-8")


def extract_frames(video_path, output_folder, num_frames=8):
    os.makedirs(output_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if total_frames == 0:
        return

    frame_idxs = [int(i * total_frames / num_frames) for i in range(num_frames)]

    count = 0
    saved = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if count in frame_idxs:
            cv2.imwrite(f"{output_folder}/frame_{saved}.jpg", frame)
            saved += 1

        count += 1

    cap.release()


def predict_video_frames(video_path, model, transform, device):
    import cv2, os, shutil
    from PIL import Image
    import torch
    import torch.nn.functional as F

    temp_folder = "temp_frames"
    os.makedirs(temp_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    frame_idxs = [int(i * total_frames / 8) for i in range(8)]

    count, saved = 0, 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if count in frame_idxs:
            cv2.imwrite(f"{temp_folder}/frame_{saved}.jpg", frame)
            saved += 1

        count += 1

    cap.release()

    fake_votes = 0
    real_votes = 0

    for img_name in os.listdir(temp_folder):
        img_path = os.path.join(temp_folder, img_name)
        img = Image.open(img_path).convert("RGB")

        img_tensor = transform(img).unsqueeze(0).to(device)

        with torch.no_grad():
            output = model(img_tensor)
            probs = F.softmax(output, dim=1)[0]

        fake_score = float(probs[0] + probs[2])
        real_score = float(probs[1])

        print(f"Frame → Fake: {fake_score:.3f}, Real: {real_score:.3f}")

        # 🔥 STRICT CLASSIFICATION
        if fake_score > real_score:
            fake_votes += 1
        else:
            real_votes += 1

    shutil.rmtree(temp_folder)

    # 🔥 FINAL DECISION (NO CONFUSION)
    if fake_votes > real_votes:
        return "Fake", 0.0, 1.0
    else:
        return "Real", 1.0, 0.0



