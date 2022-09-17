import json
import os
import io
from flask import Flask, request, jsonify
from application.image_predict import detectImage
from application.url_predict import predictUrl
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
@app.route('/')
def index():
    return 'Server is app',200

@app.route("/image", methods=['POST'])
def predict_image():
    try:
        imageData = None
        if 'imageData' in request.files:
             imageData = request.files['imageData']
        elif ('imageData' in request.form):
            imageData = request.form['imageData']
        else:
            imageData = io.BytesIO(request.get_data())
        imageData.save(os.path.join("input/", imageData.filename + ".png"))
        text = detectImage("input/" + imageData.filename + ".png")
        if text == False or text == None:
            os.remove("input/" + imageData.filename + ".png")
            return 'No car plate was found !!', 400
        os.remove("input/" + imageData.filename + ".png")
        return {'predicted-text': text}, 200    
    except Exception as e:
        print(e)
        return 'Error processing image', 500

@app.route('/url', methods=['POST'])
def predict_url():
    try:
        image_url = json.loads(request.get_data().decode('utf-8'))['url']
        text = predictUrl(image_url)
        if text == False or text == None:
            return 'No car plate was found !!', 400
        return {'predicted-text': text}, 200 
    except Exception as e:
        print('EXCEPTION:', str(e))
        return 'Error processing image'


if __name__ == '__main__':
    # Load and intialize the model
  

    # Run the server
    app.run(host='0.0.0.0', port=5000)