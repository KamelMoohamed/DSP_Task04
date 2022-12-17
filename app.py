import os
import sys
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify, abort

from processing.Processing import ImageEditor

app = Flask(__name__, template_folder="templates")

editor= ImageEditor()

@app.route('/', methods=['GET'])
def index():
    return render_template('main.html')


@app.route('/upload-image/<int:image_id>', methods=['POST'])
def upload(image_id):
    global editor
    if image_id>1:
            abort(400,description="image_id must be equal 0 or 1 only")
    if request.files['img']:
        if(not os.path.isdir("uploads")):
            os.makedirs("uploads")
        # Saving the uploaded file
        file = request.files['img']
        file_ext= file.filename.split(".")[-1]
        abspath = os.path.dirname(__file__)
        file_path = os.path.join(
            abspath, 'uploads', f"image{image_id}.{file_ext}")
        file.save(file_path)
        paths=editor.upload_img(path=file_path,image_id=image_id)


        return jsonify({"path":[file_path,*paths]}),200

    return "",400

if __name__ == '__main__':
    app.run(debug=True) 