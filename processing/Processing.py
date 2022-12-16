import cv2 as cv
import numpy as np
import os
from .imageClass import Image
class ImageEditor:
    def __init__(self) -> None:
        self.img=[Image(),Image()]
    
    def upload_img(self:object,path:str,image_id:int):
        dir_path=os.path.dirname(path)
        
        self.img[image_id].path=path
        self.img[image_id].img_data = cv.imread(path,0)
        self.img[image_id].imgfft = np.fft.fft2(self.img[image_id].img_data)
        self.img[image_id].fshift = np.fft.fftshift(self.img[image_id].imgfft)
        self.img[image_id].magnitude_spectrum = 20*np.log(np.abs(self.img[image_id].fshift))
        self.img[image_id].phase_spectrum= np.angle(self.img[image_id].fshift)

        mag_path= os.path.join(dir_path,f"mag{image_id}.jpg")
        phase_path=os.path.join(dir_path,f"phase{image_id}.jpg")

        cv.imwrite(mag_path,self.scale(self.img[image_id].magnitude_spectrum))
        cv.imwrite(phase_path,self.scale(self.img[image_id].phase_spectrum))

        return [mag_path,phase_path]
    

    def scale(self,image_array):
        image=((image_array - image_array.min()) * (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image