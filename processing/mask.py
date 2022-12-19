import cv2 as cv
import numpy as np


def create_mask(shape,data):
    defaults=[0,1,0]
    print(shape)
    init=np.full(shape,defaults[data["mode"]])
    if not data["shapes"]: return np.zeros(shape)
    for i in data["shapes"]:
        try:
            mask=np.zeros(shape)
            if i["type"]=="rect":
                cv.rectangle(mask, (int(i["x"]), int(i["y"])), (int(i["x"]+i["width"]),int(i["y"]+i["height"])), 1, -1)
            elif i["type"]=="ellipse":
                print(type(i['x']))
                cv.ellipse(mask, (int(i["x"]),int(i["y"])), (int(i["radius1"]),int(i["radius2"])), 0, 0, 360, 1, -1)
            if data["mode"]==0:
                init=np.logical_or(init,mask)
            elif data["mode"]==1:
                init=np.logical_and(init,mask)
            elif data["mode"]==2:
                init=np.logical_xor(init,mask)
        except:
            pass
    
    return init

