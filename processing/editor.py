import cv2 as cv
import numpy as np
from processing.image import Image
from .mask import Mask
import os


class Editor:
    def __init__(self) -> None:
        self.img = [[], []]
        self.shape = 0

    def upload_image(self, path, image_id, counter):
        dir_path = os.path.dirname(path)
        img = Image()
        img.set_image(path)
        if isinstance(self.img[abs(image_id-1)], Image):
            img.crop(self.shape)
        else:
            self.shape = img.shape
        mag_path = f"mag{counter}.jpg"
        phase_path = f"phase{counter}.jpg"
        img.save_magnitude(os.path.join(dir_path, mag_path))
        img.save_phase(os.path.join(dir_path, phase_path))
        self.img[image_id] = img
        return [mag_path, phase_path]

    def mix_images(self, counter, commands):
        mag_mask = Mask.create_mask(
            self.shape, commands["mag_shapes"], commands["canvas_dim"], 1)

        phase_mask = Mask.create_mask(
            self.shape, commands["phase_shapes"], commands["canvas_dim"], 2)

        if np.max(mag_mask) == 0:
            commands["magnitude"] = "empty"
        if np.max(phase_mask) == 0:
            commands["phase"] = "empty"

        # Non Uniform Mode
        if commands["magnitude"] != "empty" and commands["phase"] != "empty":
            shifted_fft = mag_mask*self.img[commands["magnitude"]].magnitude_spectrum * np.exp(
                1j*phase_mask*self.img[commands["phase"]].phase_spectrum)

        # Uniform Modes
        elif commands["magnitude"] == "empty" and commands["phase"] != "empty":
            shifted_fft = 1000 * \
                np.exp(1j*phase_mask *
                       self.img[commands["phase"]].phase_spectrum)
        elif commands["phase"] == "empty" and commands["magnitude"] != "empty":
            shifted_fft = mag_mask * \
                self.img[commands["magnitude"]].magnitude_spectrum
        else:
            shifted_fft = np.zeros(self.shape)
        percentage = 0.7
        try:
            max_point = np.where(self.img[commands["magnitude"]].magnitude_spectrum ==
                                 self.img[commands["magnitude"]].magnitude_spectrum.max())
            max_point = (max_point[0][0], max_point[1][0])
            if phase_mask[max_point[0], max_point[1]] == 1:
                percentage = 0.4
        except:
            pass

        # Saving
        path = os.path.join(os.path.dirname(
            self.img[0].path), f"output{counter}.jpg")
        mixed_image = Image()
        mixed_image.set_shifted_fft(shifted_fft)
        if np.mean(phase_mask) > percentage and commands["magnitude"] != "empty" and commands["phase"] != "empty":
            mixed_image.save_img(path=path)
        else:
            mixed_image.save_img("hist", path=path)
        return path
