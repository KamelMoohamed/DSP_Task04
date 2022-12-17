import cv2 as cv
import numpy as np


def create_mask(shape,data):
    defaults=[0,1,0]
    init=np.full(shape,defaults[data["mode"]])
    if not data["shapes"]: return np.zeros(shape)
    for i in data["shapes"]:
        mask=np.zeros(shape)
        if i["type"]=="rect":
            cv.rectangle(mask,(i["x"],i["y"]),(i["x"]+i["width"],i["y"]+i["height"]),1,-1)
        elif i["type"]=="ellipse":
            cv.ellipse(mask,(i["x"],i["y"]),(i["radius1"],i["radius2"]),0,0,360,1,-1)
        if data["mode"]==0:
            init=np.logical_or(init,mask)
        elif data["mode"]==1:
            init=np.logical_and(init,mask)
        elif data["mode"]==2:
            init=np.logical_xor(init,mask)
    
    return init

