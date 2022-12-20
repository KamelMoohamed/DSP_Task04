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
        
        self.img[image_id].path=path
        self.img[image_id].img_data = cv.imread(path,cv.IMREAD_GRAYSCALE)
        if(self.img[abs(image_id-1)].img_data.size==0):
            self.shape= self.img[image_id].img_data.shape
        self.img[image_id].img_data=self.crop(self.img[image_id].img_data,self.shape)
        cv.imwrite(path, self.img[image_id].img_data)
        self.img[image_id].imgfft = np.fft.fft2(self.img[image_id].img_data)
        self.img[image_id].fshift = np.fft.fftshift(self.img[image_id].imgfft)
        self.img[image_id].magnitude_spectrum = np.abs(self.img[image_id].fshift)
        self.img[image_id].phase_spectrum= np.angle(self.img[image_id].fshift)
        mag_path= f"mag{counter}.jpg"
        phase_path=f"phase{counter}.jpg"

        cv.imwrite(os.path.join(dir_path, mag_path), self.scale(20*np.log(self.img[image_id].magnitude_spectrum)))
        cv.imwrite(os.path.join(dir_path, phase_path), self.scale(self.img[image_id].phase_spectrum))
        

        return [mag_path, phase_path]
    

    def crop(self,img_data,shape):
        index=np.argmax(shape)
        ratio= shape[index]/img_data.shape[index]
        if ratio>1:
            width = int(img_data.shape[1] * ratio)
            height = int(img_data.shape[0] * ratio)
            dim = (width, height)
            print(dim)
            img_data = cv.resize(img_data, dim, interpolation = cv.INTER_AREA)
        
        axis1= abs(shape[0]-img_data.shape[0])//2
        axis2= abs(shape[1]-img_data.shape[1])//2
        return img_data[axis1:axis1+shape[0],axis2:axis2+shape[1]]

    def scale(self,image_array):
        image=((image_array - image_array.min()) * (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image

    def mix(self,counter,commands):
        shape= self.shape
        mag_mask=create_mask(shape,commands["mag_shapes"],commands["canvas_dim"],1)
        phase_mask=create_mask(shape,commands["phase_shapes"],commands["canvas_dim"],2)
        if commands["magnitude"]=="empty":
            shifted_fft= np.exp(1j*phase_mask*self.img[commands["phase"]].phase_spectrum)
        elif commands["phase"]=="empty":
            shifted_fft= mag_mask*self.img[commands["magnitude"]].magnitude_spectrum
        else:
            shifted_fft=mag_mask*self.img[commands["magnitude"]].magnitude_spectrum* np.exp(1j*phase_mask*self.img[commands["phase"]].phase_spectrum)
        
        max_point=np.where(self.img[commands["magnitude"]].magnitude_spectrum==self.img[commands["magnitude"]].magnitude_spectrum.max())
        max_point=(max_point[0][0],max_point[1][0])
        fft = np.fft.ifftshift(shifted_fft)
        img = np.fft.ifft2(fft)
        path=os.path.join(os.path.dirname(self.img[0].path),f"output{counter}.jpg")
        if phase_mask[max_point[0],max_point[1]]==1:
            percentage=0.12
        else: percentage=0.7
        if np.mean(phase_mask) > percentage:
            image= self.scale(np.abs(img))
            cv.imwrite(path,image)
        else:
            image= self.scale(cv.equalizeHist(np.abs(img).astype(np.uint8)))
            cv.imwrite(path,image)
        return path

        

         