from dataclasses import dataclass
import numpy as np

@dataclass
class Image:
    path:str=""
    img_data:np.ndarray=np.array([])
    imgfft:np.ndarray = np.array([])
    fshift:np.ndarray =np.array([])
    magnitude_spectrum:np.ndarray = np.array([])
    phase_spectrum:np.ndarray=np.array([])