import cv2 as cv
import numpy as np
import os


class Image:
    def __init__(self) -> None:
        self.path: str = ""
        self.img_data: np.ndarray = np.array([])
        self.imgfft: np.ndarray = np.array([])
        self.fshift: np.ndarray = np.array([])
        self.magnitude_spectrum: np.ndarray = np.array([])
        self.phase_spectrum: np.ndarray = np.array([])

    def set_image(self, path: str):
        self.path = path
        self.img_data = cv.imread(self.path, cv.IMREAD_GRAYSCALE)
        self.shape = self.img_data.shape

    def set_image_data(self, image_data: np.ndarray):
        self.img_data = image_data
        self.shape = self.img_data.shape

    def set_fft(self, fft: np.ndarray):
        self.imgfft = fft
        self.shape = self.imgfft.shape

    def set_shifted_fft(self, fshift: np.ndarray):
        self.fshift = fshift
        self.shape = self.fshift.shape

    def get_image_data(self):
        if self.img_data.size == 0:
            if self.imgfft.size == 0:
                self.get_fft()
            self.img_data = np.abs(np.fft.ifft2(self.imgfft))
        return self.img_data

    def get_fft(self):
        if self.imgfft.size == 0:
            if self.fshift.size != 0:
                self.imgfft = np.fft.ifftshift(self.fshift)
                return self.imgfft
            self.imgfft = np.fft.fft2(self.img_data)
        return self.imgfft

    def get_shifted_fft(self):
        if self.fshift.size == 0:
            if self.imgfft.size == 0:
                self.get_fft()
            self.fshift = np.fft.fftshift(self.imgfft)
        return self.fshift

    def save_img(self, contrast=None, path=None):
        if path:
            self.path = path
        if self.img_data.size == 0:
            self.get_image_data()
        if contrast == "hist":
            self.img_data = cv.equalizeHist(self.img_data.astype(np.uint8))
        cv.imwrite(self.path, self.scale(self.img_data))

    def save_magnitude(self, path):
        if self.magnitude_spectrum.size == 0:
            if self.fshift.size == 0:
                self.get_shifted_fft()
            self.magnitude_spectrum = np.abs(self.fshift)
        cv.imwrite(path, self.scale(20*np.log(self.magnitude_spectrum)))

    def save_phase(self, path):
        if self.phase_spectrum.size == 0:
            if self.fshift.size == 0:
                self.get_shifted_fft()
            self.phase_spectrum = np.angle(self.fshift)
        cv.imwrite(path, self.scale(self.phase_spectrum))

    def scale(self, image_array: np.ndarray):
        image = ((image_array - image_array.min()) *
                 (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image

    def crop(self, shape):
        if shape == 0:
            return
        index = np.argmax(shape)
        ratio = shape[index]/self.img_data.shape[index]
        if ratio > 1:
            width = int(self.img_data.shape[1] * ratio)
            height = int(self.img_data.shape[0] * ratio)
            dim = (width, height)
            self.img_data = cv.resize(
                self.img_data, dim, interpolation=cv.INTER_AREA)

        axis1 = abs(shape[0] - self.img_data.shape[0])//2
        axis2 = abs(shape[1] - self.img_data.shape[1])//2
        self.img_data = self.img_data[axis1:axis1 +
                                      shape[0], axis2:axis2+shape[1]]
