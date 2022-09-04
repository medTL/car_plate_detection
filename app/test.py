import time
from array import array
from msrest.authentication import CognitiveServicesCredentials
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from io import BytesIO
from PIL import Image
from matplotlib.patches import Rectangle
import matplotlib.pyplot as plt
from turtle import width
import cv2
import os
import sys
import requests
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive
gauth = GoogleAuth()
drive = GoogleDrive(gauth)


subscription_key = "06ed28182bb24e23ad36f6debb619e6d"
endpoint = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/7444c6af-a726-4911-9344-53f9e428cf1f/detect/iterations/Iteration7/image"
subscription_key_ocr = "35bbf187f138426dbb7c9563e93c1d31"
endpoint_ocr = "https://ocrp.cognitiveservices.azure.com/"
computervision_client = ComputerVisionClient(
    endpoint_ocr, CognitiveServicesCredentials(subscription_key_ocr))
ocr_url = endpoint
image_path = './download.jpg'
# Read the image into a byte array
image_data = open(image_path, "rb").read()
image = cv2.imread(image_path)
# print(image)
# Set Content-Type to octet-stream
headers = {'Prediction-Key': subscription_key,
           'Content-Type': 'application/octet-stream'}
params = {'language': 'unk', 'detectOrientation': 'true'}
# put the byte array into your post request
response = requests.post(ocr_url, headers=headers,
                         params=params, data=image_data)

response.raise_for_status()
analysis = response.json()
# print(analysis['predictions'])
size = image.shape
height = size[0]
width = size[1]

print(size)
for item in analysis['predictions']:
    if item['tagName'] == 'matricule' and item['probability'] > 0.6:
        box = item['boundingBox']
        y = int(box['top'] * height)
        x = int(box['left'] * width)
        w = int(box['width'] * width)
        h = int(box['height'] * height)
        plate = image[y:y+h, x:x+w]

        # cv2.imshow('image',plate)
        # cv2.waitKey(0)

        # with file
   
        with open("./download.jpg", "rb") as image_stream:
            read_response = computervision_client.read_in_stream(image_stream,    mode="Printed",
                                                                 raw=True)
            read_operation_location = read_response.headers["Operation-Location"]
            # Grab the ID from the URL

            operation_id = read_operation_location.split("/")[-1]
            while True:
                read_result = computervision_client.get_read_result(operation_id)
                if read_result.status not in ['notStarted', 'running']:
                    break
            time.sleep(1)

            # Print the detected text, line by line
            if read_result.status == OperationStatusCodes.succeeded:
                for text_result in read_result.analyze_result.read_results:
                    for line in text_result.lines:
                        print(line.text)
                        # print(line.bounding_box)
                  
