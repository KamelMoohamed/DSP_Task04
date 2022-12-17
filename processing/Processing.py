import cv2 as cv
import numpy as np
import os
from .imageClass import Image
from .mask import *
class ImageEditor:
    def __init__(self) -> None:
        self.img=[Image(),Image()]
    
    def upload_img(self:object,path:str,image_id:int):
        dir_path=os.path.dirname(path)
        
        self.img[image_id].path=path
        self.img[image_id].img_data = cv.imread(path,cv.IMREAD_GRAYSCALE)
        self.img[image_id].imgfft = np.fft.fft2(self.img[image_id].img_data)
        self.img[image_id].fshift = np.fft.fftshift(self.img[image_id].imgfft)
        self.img[image_id].magnitude_spectrum = np.abs(self.img[image_id].fshift)
        self.img[image_id].phase_spectrum= np.angle(self.img[image_id].fshift)

        mag_path= os.path.join(dir_path,f"mag{image_id}.jpg")
        phase_path=os.path.join(dir_path,f"phase{image_id}.jpg")

        cv.imwrite(mag_path,self.scale(20*np.log(self.img[image_id].magnitude_spectrum)))
        cv.imwrite(phase_path,self.scale(self.img[image_id].phase_spectrum))
        return [mag_path,phase_path]
    

    def scale(self,image_array):
        image=((image_array - image_array.min()) * (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image

    def mix(self,commands):
        shape= self.img[0].img_data.shape
        mag_mask=create_mask(shape,commands["mag_shapes"])
        phase_mask=create_mask(shape,commands["phase_shapes"])
        if commands["magnitude"]=="empty":
            shifted_fft= np.exp(1j*phase_mask*self.img[commands["phase"]].phase_spectrum)
        elif commands["phase"]=="empty":
            shifted_fft= mag_mask*self.img[commands["magnitude"]].magnitude_spectrum
        else:
            shifted_fft=mag_mask*self.img[commands["magnitude"]].magnitude_spectrum* np.exp(1j*phase_mask*self.img[commands["phase"]].phase_spectrum)
        
        fft = np.fft.ifftshift(shifted_fft)
        img = np.fft.ifft2(fft)

        if commands["magnitude"]=="empty":
            cv.imwrite(os.path.join(os.path.dirname(self.img[0].path),"output.jpg"),self.scale(np.abs(img)))
        else:
            cv.imwrite(os.path.join(os.path.dirname(self.img[0].path),"output.jpg"),self.scale(cv.equalizeHist(np.abs(img).astype(np.uint8))))

        