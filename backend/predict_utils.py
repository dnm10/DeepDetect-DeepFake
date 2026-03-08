import numpy as np
import cv2
import torch
import base64
import matplotlib.pyplot as plt
from io import BytesIO

from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image


# Convert image to base64
def encode_image(img):

    _, buffer = cv2.imencode(".png", img)

    return base64.b64encode(buffer).decode("utf-8")


# =========================
# GradCAM
# =========================
def generate_gradcam(model, input_tensor, image):

    target_layer = model.layer4[-1]

    cam = GradCAM(
        model=model,
        target_layers=[target_layer],
        use_cuda=torch.cuda.is_available()
    )

    grayscale_cam = cam(input_tensor=input_tensor)[0]

    rgb_img = np.float32(image) / 255

    visualization = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    return encode_image(visualization)


# =========================
# FFT Spectrum
# =========================
def generate_fft(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    f = np.fft.fft2(gray)

    fshift = np.fft.fftshift(f)

    magnitude = 20 * np.log(np.abs(fshift) + 1)

    magnitude = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)

    magnitude = magnitude.astype(np.uint8)

    magnitude = cv2.applyColorMap(magnitude, cv2.COLORMAP_JET)

    return encode_image(magnitude)


# =========================
# Face Heatmap
# =========================
def generate_face_heatmap(image):

    heatmap = cv2.GaussianBlur(image, (55, 55), 0)

    heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

    overlay = cv2.addWeighted(image, 0.6, heatmap, 0.4, 0)

    return encode_image(overlay)


# =========================
# Probability Chart
# =========================
def generate_probability_chart(real_prob, fake_prob):

    labels = ["Real", "Fake"]

    values = [real_prob, fake_prob]

    fig, ax = plt.subplots()

    ax.bar(labels, values, color=["green", "red"])

    ax.set_ylabel("Probability %")
    ax.set_title("Prediction Probability")

    buf = BytesIO()

    plt.savefig(buf, format="png")

    plt.close()

    buf.seek(0)

    return base64.b64encode(buf.read()).decode("utf-8")


# =========================
# Confidence Gauge
# =========================
def generate_confidence_gauge(confidence):

    fig, ax = plt.subplots()

    ax.barh(["Confidence"], [confidence], color="blue")

    ax.set_xlim(0, 100)

    ax.set_title("Model Confidence")

    buf = BytesIO()

    plt.savefig(buf, format="png")

    plt.close()

    buf.seek(0)

    return base64.b64encode(buf.read()).decode("utf-8")