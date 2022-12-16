import cv2 as cv
import numpy as np

class Processing:
    def convert_to_fourier(self, path):
        self.img = cv.imread(path, 0)
        self.dft = cv.dft(np.float32(self.img),flags = cv.DFT_COMPLEX_OUTPUT)
        self.dft_shift = np.fft.fftshift(self.dft)
        self.magnitude_spectrum = 20*np.log(cv.magnitude(self.dft_shift[:,:,0], self.dft_shift[:,:,1]))
        return self.magnitude_spectrum
