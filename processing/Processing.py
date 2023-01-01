import cv2 as cv
import numpy as np
import os
from .imageClass import Image
from .mask import *
class ImageEditor:
    def __init__(self) -> None:
        self.img=[Image(),Image()]
        self.shape=(0,0)
    
    def upload_img(self:object,path:str,image_id:int,counter:int):
        dir_path = os.path.dirname(path)
        
        if(self.img[abs(image_id-1)].img_data.size==0):
            self.shape= 0
        self.img[image_id]=Image("init",path,self.shape)
        if(self.img[abs(image_id-1)].img_data.size==0):
            self.shape= self.img[image_id].img_data.shape
        mag_path= f"mag{counter}.jpg"
        phase_path=f"phase{counter}.jpg"

        cv.imwrite(os.path.join(dir_path, mag_path), self.scale(20*np.log(self.img[image_id].magnitude_spectrum)))
        cv.imwrite(os.path.join(dir_path, phase_path), self.scale(self.img[image_id].phase_spectrum))

        return [mag_path, phase_path]
    
    def scale(self,image_array):
        image=((image_array - image_array.min()) * (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image

    def mix(self,counter,commands):
        shape= self.shape
        mag_mask=create_mask(shape,commands["mag_shapes"],commands["canvas_dim"],1)
        phase_mask=create_mask(shape,commands["phase_shapes"],commands["canvas_dim"],2)
        if np.max(mag_mask)==0:
            commands["magnitude"]="empty"
        if np.max(phase_mask)==0:
            commands["phase"]="empty"

        if commands["magnitude"]!="empty" and commands["phase"]!="empty":
            shifted_fft=mag_mask*self.img[commands["magnitude"]].magnitude_spectrum* np.exp(1j*phase_mask*self.img[commands["phase"]].phase_spectrum)
        elif commands["magnitude"]=="empty" and commands["phase"]!="empty":
            shifted_fft= 1000*np.exp(1j*phase_mask*self.img[commands["phase"]].phase_spectrum)
        elif commands["phase"]=="empty" and commands["magnitude"]!="empty":
            shifted_fft= mag_mask*self.img[commands["magnitude"]].magnitude_spectrum
        else:
            shifted_fft=np.zeros(self.shape)
        percentage=0.7
        try:
            max_point=np.where(self.img[commands["magnitude"]].magnitude_spectrum==self.img[commands["magnitude"]].magnitude_spectrum.max())
            max_point=(max_point[0][0],max_point[1][0])
            if phase_mask[max_point[0],max_point[1]]==1:
                percentage=0.4
        except:
            pass
        path=os.path.join(os.path.dirname(self.img[0].path),f"output{counter}.jpg")
        mixed_img= Image("mix",shifted_fft,path)
        
        if np.mean(phase_mask) > percentage and commands["magnitude"]!="empty" and commands["phase"]!="empty":
            image= self.scale(mixed_img.img_data)
            cv.imwrite(path,image)
        else:
            image= self.scale(cv.equalizeHist(mixed_img.img_data.astype(np.uint8)))
            cv.imwrite(path,image)
        return path

        

         