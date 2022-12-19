import cv2 as cv
import numpy as np


def create_mask(shape,data,canvas_dim):
    print(shape)
    print(canvas_dim)
    scales = scales_calc(shape,canvas_dim)
    print(scales)
    defaults=[0,1,0]
    print(shape)
    init=np.full(shape,defaults[data["mode"]])
    if not data["shapes"]: return np.zeros(shape)
    for i in data["shapes"]:
        try:
            mask=np.zeros(shape)
            if i["type"]=="rect":
                cv.rectangle(mask, (int(i["x"]*scales[0]), int(i["y"]*scales[1])), (int(i["x"]*scales[0]+i["width"]*scales[0]),int(i["y"]*scales[1]+i["height"]*scales[1])), 1, -1)
            elif i["type"]=="ellipse":
                print(type(i['x']))
                cv.ellipse(mask, (int(i["x"]*scales[0]),int(i["y"]*scales[1])), (int(i["radius1"]*scales[0]),int(i["radius2"]*scales[1])), 0, 0, 360, 1, -1)
            if data["mode"]==0:
                init=np.logical_or(init,mask)
            elif data["mode"]==1:
                init=np.logical_and(init,mask)
            elif data["mode"]==2:
                init=np.logical_xor(init,mask)
        except:
            pass
    
    return init



def scales_calc(image_dim, canvas_dim):
    if (image_dim[0]>image_dim[1]):
        scaleY= image_dim[0]/ canvas_dim[0]
        new_canvas_w= image_dim[0]/scaleY
        scaleX=image_dim[1]/new_canvas_w
       
    elif (image_dim[0]<image_dim[1]):
        scaleX= image_dim[1]/ canvas_dim[1]
        new_canvas_h= image_dim[1]/scaleX
        scaleY=image_dim[0]/new_canvas_h
    elif (image_dim[0]== image_dim[1]):
        scaleX= image_dim[1]/ canvas_dim[1]
        scaleY= scaleX

    return[scaleX,scaleY]
