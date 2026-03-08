import numpy as np
import cv2
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.image import show_cam_on_image


def generate_gradcam(model, input_tensor, image):

    target_layer = model.layer4[-1]

    cam = GradCAM(model=model, target_layers=[target_layer])

    grayscale_cam = cam(input_tensor=input_tensor)[0]

    rgb_img = np.float32(image) / 255

    heatmap = show_cam_on_image(rgb_img, grayscale_cam, use_rgb=True)

    return heatmap


def generate_fft(image):

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    f = np.fft.fft2(gray)
    fshift = np.fft.fftshift(f)

    magnitude = 20 * np.log(np.abs(fshift) + 1)

    magnitude = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)

    return magnitude