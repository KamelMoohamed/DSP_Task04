import os
import sys
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request

sys.path.append('./processing')
app = Flask(__name__, template_folder="templates")


@app.route('/', methods=['GET'])
def index():
    return render_template('main.html')


@app.route('/upload-image', methods=['POST'])
def upload():
    if request.files['file']:
        # Saving the uploaded file
        file = request.files['file']
        abspath = os.path.dirname(__file__)
        file_path = os.path.join(
            abspath, 'uploads', secure_filename(file.filename))
        file_path += '.png'
        file.save(file_path)
        return 200

    return 400

if __name__ == '__main__':
    app.run(debug=True) 