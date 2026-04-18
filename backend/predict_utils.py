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
    import numpy as np

    temp_folder = "temp_frames"

    # Clean previous frames
    if os.path.exists(temp_folder):
        shutil.rmtree(temp_folder)
    os.makedirs(temp_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # ❗ Handle invalid video
    if total_frames <= 0:
        cap.release()
        shutil.rmtree(temp_folder)
        return "Error", 0.0, 0.0

    # Sample frames evenly
    num_frames = min(8, total_frames)
    frame_idxs = [int(i * total_frames / num_frames) for i in range(num_frames)]

    count, saved = 0, 0

    # =========================
    # Extract frames
    # =========================
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if count in frame_idxs:
            cv2.imwrite(f"{temp_folder}/frame_{saved}.jpg", frame)
            saved += 1

        count += 1

    cap.release()

    # ❗ No frames extracted
    if saved == 0:
        shutil.rmtree(temp_folder)
        return "Error", 0.0, 0.0

    # =========================
    # Prepare batch
    # =========================
    images = []

    for img_name in sorted(os.listdir(temp_folder)):
        img_path = os.path.join(temp_folder, img_name)

        try:
            img = Image.open(img_path).convert("RGB")
            img_tensor = transform(img)
            images.append(img_tensor)
        except Exception as e:
            print("Skipping frame:", img_name, e)

    shutil.rmtree(temp_folder)

    if len(images) == 0:
        return "Error", 0.0, 0.0

    batch = torch.stack(images).to(device)

    # =========================
    # Model inference
    # =========================
    with torch.no_grad():
        outputs = model(batch)
        probs = F.softmax(outputs, dim=1)

    # =========================
    # Prediction logic
    # =========================
    # =========================
    # Prediction logic
    # =========================
    # To match notebook exactly, use MEDIAN instead of MEAN
    real_scores = probs[:, 1].cpu().numpy()
    video_score = float(np.median(real_scores))

    # 🔥 FINAL DECISION LOGIC (matches notebook: >0.7)
    if video_score > 0.7:
        prediction = "Real"
    else:
        prediction = "Fake"

    # For 2-class video dataset, we combine Fake (0) and Synthetic (2)
    fake_scores = probs[:, 0].cpu().numpy() + probs[:, 2].cpu().numpy()
    
    real_prob = video_score
    fake_prob = float(np.median(fake_scores)) # The remaining probabilities

    # Debug logs
    print("Frame real scores:", real_scores)
    print("Median Real Score:", video_score)
    print("Median Fake/Synthetic Score:", fake_prob)

    return prediction, real_prob, fake_prob


