import os
import shutil
from flask import Flask, render_template, request, jsonify, abort

from processing.Processing import ImageEditor

app = Flask(__name__, template_folder="templates")

editor= ImageEditor()
counter=0
imgCounter=0
@app.route('/', methods=['GET'])
def index():
    return render_template('main.html')


@app.route('/upload-image/<int:image_id>', methods=['POST'])
def upload(image_id):
    global editor
    global counter
    global imgCounter
    if image_id>1:
            abort(400,description="image_id must be equal 0 or 1 only")
    if request.files['img']:
        if(not os.path.isdir(os.path.join("static","uploads"))):
            os.makedirs(os.path.join("static","uploads"))
        # Saving the uploaded file
        file = request.files['img']
        file_ext= file.filename.split(".")[-1]  
        abspath = os.path.dirname(__file__)
        file_path = os.path.join(
            abspath, 'static', 'uploads', f"image{image_id}.{file_ext}")
        file.save(file_path)
        paths=editor.upload_img(path=file_path,image_id=image_id,counter=imgCounter)
        imgCounter+=1
        counter=0
        return jsonify({"path":[f"../static/uploads/image{image_id}.{file_ext}",*paths]}),201

    return "",400

@app.route("/edit-image/<int:image_id>", methods = ['POST'])
def edit_image(image_id):
    global editor
    editor.img[abs(image_id-1)]=editor.img[image_id]
    print(editor.img)
    return "",201

@app.route("/mix-image",methods=["POST"])
def mix_image():
    global editor
    global counter
    commands= request.json
    counter+=1
    outputPath=editor.mix(counter,commands=commands)
    outputPath=list(outputPath)
    outputPath[-5]=counter-1
    try:
        os.remove("".join(map(str, outputPath)))
    except:
        pass
    return jsonify({"path":f"../static/uploads/output{counter}.jpg"}),200

if __name__ == '__main__':
    if(os.path.isdir(os.path.join("static","uploads"))):
            shutil.rmtree(os.path.join(os.path.dirname(__file__),"static","uploads"))
    app.run(debug=True) 