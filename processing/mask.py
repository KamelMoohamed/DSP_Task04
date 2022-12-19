import cv2 as cv
import numpy as np


def create_mask(Shape,data,canvas_dim):
    scales=scales_calc(Shape,canvas_dim=canvas_dim)
    defaults=[0,1,0]
    init=np.full(Shape,defaults[data["mode"]])
    for shape in data["shapes"]:
        if shape["type"]=="rect":
            X= int(shape["x"]+scales[2])
            Y= int(shape["y"]+scales[3])
            Height= int(shape["height"]*scales[1])
            Width= int(shape["width"]*scales[0])
            mask=np.zeros(Shape)
            cv.rectangle(mask,(X,Y),(X+Width,Y+Height),1,-1)
        elif shape["type"]=="ellipse":
            X= int((shape["x"]+scales[2])*scales[0])
            Y= int((shape["y"]+scales[3])*scales[1])
            Height= int(shape["radius2"]*scales[1])*2
            Width= int(shape["radius1"]*scales[0])*2
            mask=np.zeros(Shape)
            cv.ellipse(mask,(X,Y),(Width,Height),0,0,360,1,-1)
        
        if data["mode"]==0:
            init=np.logical_or(init,mask)
        elif data["mode"]==1:
            init=np.logical_and(init,mask)
        elif data["mode"]==2:
            init=np.logical_xor(init,mask)
    cv.imwrite("output.png",scale(init.astype(np.int8)))

    return init

def scale(image_array):
        image=((image_array - image_array.min()) * (1/(image_array.max() - image_array.min()) * 255)).astype('uint8')
        return image


def scales_calc(image_dim, canvas_dim):
    if (image_dim[0]>=image_dim[1]):
        scaleY= image_dim[0]/ canvas_dim[0]
        new_canvas_w= image_dim[1]/scaleY
        offsetX= canvas_dim[1]-new_canvas_w
        offsetX= 0.5*offsetX
        offsetY=0
        scaleX=image_dim[1]/new_canvas_w
    elif (image_dim[0]<image_dim[1]):
        scaleX= image_dim[1]/ canvas_dim[1]
        new_canvas_h= image_dim[0]/scaleX
        offsetY= canvas_dim[0]-new_canvas_h
        offsetY= 0.5*offsetY
        offsetX=0
        scaleY=image_dim[0]/new_canvas_h
  

    return[scaleX,scaleY,0,0]
