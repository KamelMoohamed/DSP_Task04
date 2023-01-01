from dataclasses import dataclass
import numpy as np
import cv2 as cv

@dataclass
class Image:
    path:str=""
    img_data:np.ndarray=np.array([])
    imgfft:np.ndarray = np.array([])
    fshift:np.ndarray =np.array([])
    magnitude_spectrum:np.ndarray = np.array([])
    phase_spectrum:np.ndarray=np.array([])
    def __init__(self, *args) -> None:
        if not args:
            return
        if args[0]=="init":
            self.path=args[1]
            
            self.img_data = cv.imread(self.path,cv.IMREAD_GRAYSCALE)
            self.img_data=self.crop(self.img_data,args[2])
            cv.imwrite(self.path, self.img_data)
            self.imgfft = np.fft.fft2(self.img_data)
            self.fshift = np.fft.fftshift(self.imgfft)
            self.magnitude_spectrum = np.abs(self.fshift)                                   
            self.phase_spectrum= np.angle(self.fshift)
        elif args[0]=="mix":
            self.fshift=args[1]
            self.imgfft = np.fft.ifftshift(self.fshift)
            self.img_data = np.abs(np.fft.ifft2(self.imgfft))

    def crop(self,img_data,shape):
        if shape==0:
            return img_data
        index=np.argmax(shape)
        ratio= shape[index]/img_data.shape[index]
        if ratio>1:
            width = int(img_data.shape[1] * ratio)
            height = int(img_data.shape[0] * ratio)
            dim = (width, height)
            img_data = cv.resize(img_data, dim, interpolation = cv.INTER_AREA)
        
        axis1= abs(shape[0]-img_data.shape[0])//2
        axis2= abs(shape[1]-img_data.shape[1])//2
        return img_data[axis1:axis1+shape[0],axis2:axis2+shape[1]]

