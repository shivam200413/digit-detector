import torch
import torch.nn as nn
from matplotlib import pyplot as plt
from torchvision.transforms import ToTensor
from torchvision import datasets
from torch.utils.data import DataLoader

class two(nn.Module):
  def __init__(self):
    super().__init__()
    self.b1 = nn.Sequential(
        nn.Conv2d(in_channels = 1 , out_channels = 10 , kernel_size  = (3,3) ,stride = 1 , padding = 1 ),
        nn.ReLU(),
        nn.Conv2d(in_channels = 10 , out_channels = 10 , kernel_size = (3,3) , stride = 1 , padding = 1 ),
        nn.MaxPool2d(kernel_size = (2,2) , stride = 1),
    )
    self.b2 = nn.Sequential(
        nn.Conv2d(in_channels = 10 , out_channels = 10 , kernel_size = (3,3) , stride = 1 , padding = 1 ),
        nn.ReLU(),
        nn.Conv2d(in_channels = 10 , out_channels = 10 , kernel_size = (3,3) , stride = 1 , padding = 1 ),
        nn.MaxPool2d(kernel_size = (2,2) , stride = 2),
     )
    self.Classify = nn.Sequential(
      nn.Flatten(),
      nn.Linear(in_features =10*13*13 , out_features = 10),
    )
  def forward(self,X):
    try :
      X1 = self.b1(X)
      #print(X1.shape)
      X2 = self.b2(X1)
      #print(X2.shape)
      X3 =  self.Classify(X2)
      return X3
    except Exception as  e:

      print(e)
      print(e.__traceback__.tb_lineno)
    return None

  def pred(self , X):
    self.eval()
    with torch.inference_mode():
      return self(X)
