from tkinter.messagebox import NO
import cv2
import os
import sys
import requests
from io import BytesIO
from PIL import Image
import urllib.request
import numpy as np
import time
import codecs
from msrest.authentication import CognitiveServicesCredentials
from azure.cognitiveservices.vision.computervision.models import VisualFeatureTypes
from azure.cognitiveservices.vision.computervision.models import OperationStatusCodes
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
subscription_key_ocr = "35bbf187f138426dbb7c9563e93c1d31"
endpoint_ocr = "https://ocrp.cognitiveservices.azure.com/"
subscription_key = "06ed28182bb24e23ad36f6debb619e6d"
endpoint = "https://southcentralus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/7444c6af-a726-4911-9344-53f9e428cf1f/detect/iterations/Iteration5/url"
ocr_url = endpoint
computervision_client = ComputerVisionClient(
    endpoint_ocr, CognitiveServicesCredentials(subscription_key_ocr))
image_data = "https://ag-spots-2015.o.auroraobjects.eu/2015/04/19/bmw-m3-e92-coupe-c363419042015140543_1.jpg"
headers = {'Prediction-Key': subscription_key,
           'Content-Type': 'application/json'}
params = {'language': 'unk', 'detectOrientation': 'true'}
# put the byte array into your post request
response = requests.post(endpoint, headers=headers,
                         json={"Url": image_data})

response.raise_for_status()

analysis = response.json()
req = urllib.request.urlopen(image_data)
arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
image = cv2.imdecode(arr, -1)
size = image.shape
height = size[0]
width = size[1]
plate = None
for item in analysis['predictions']:
    if item['tagName'] == 'matricule' and item['probability'] > 0.2:
        box = item['boundingBox']
        y = int(box['top'] * height)
        x = int(box['left'] * width - 100)
        w = int(box['width'] * width + 100)
        h = int(box['height'] * height)
        plate = image[y:y+h, x:x+w]
if len(plate) :
    cv2.imwrite('tmp.png', plate)
    with open("./tmp.png", "rb") as image_stream:
        try:
            read_response = computervision_client.read_in_stream(image_stream,
                                                                        raw=True)
            read_operation_location = read_response.headers["Operation-Location"]
                # Grab the ID from the URL
            operation_id = read_operation_location.split("/")[-1]

            while True:
                read_result = computervision_client.get_read_result(operation_id)
                text = ""
                if read_result.status not in ['notStarted', 'running']:
                    for text_result in read_result.analyze_result.read_results:
                        for line in text_result.lines:
                            print(line.text)
                            text = str(line.text)
                           
                        
                    break
                time.sleep(1)

                    # Print the detected text, line by line
                #if read_result.status == OperationStatusCodes.succeeded:
           # os.remove("./tmp.png") 
            text_file = codecs.open("./data.txt", "w", "utf-8")

#write string to file
            text_file.write(text)
#close file
            text_file.close()      
        except Exception as e:
            print(e)
