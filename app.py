import os
import sys
from werkzeug.utils import secure_filename
from flask import Flask, render_template, request, jsonify

from processing.Processing import Processing

sys.path.append('./processing')
app = Flask(__name__, template_folder="templates")


@app.route('/', methods=['GET'])
def index():
    return render_template('main.html')


@app.route('/upload-image', methods=['POST'])
def upload():
    print(request.files)
    if request.files['img']:
        # Saving the uploaded file
        file = request.files['img']
        abspath = os.path.dirname(__file__)
        file_path = os.path.join(
            abspath, 'uploads', secure_filename(file.filename))
        file.save(file_path)

        # Calculating Fourier
        processing = Processing()
        magnitudeSpectrum = processing.convert_to_fourier(file_path)

        return jsonify({
                'image':magnitudeSpectrum.tolist()
            }), 200

    return 400

if __name__ == '__main__':
    app.run(debug=True) 