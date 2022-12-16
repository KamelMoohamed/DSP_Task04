let uploadImage = document.getElementsByClassName("upload-img")
let firstImg = document.getElementById("img1");
firstImg.addEventListener("change", (e) => {
  sendImage();
  uploadFile("img1");
  setTimeout(makeGray.bind(null, "first-img-canvas"), 90);
  for(i=0; i<uploadImage.length; i++){
    if(uploadImage[i].classList[1]==firstImg.classList[0]){
      uploadImage[i].classList.add("hide-frame")
    }
  }
});
let secondImg = document.getElementById("img2");
secondImg.addEventListener("change", (e) => {
  sendImage();
  uploadFile("img2");
  setTimeout(makeGray.bind(null, "second-img-canvas"), 90);
  for(i=0; i<uploadImage.length; i++){
    if(uploadImage[i].classList[1]==secondImg.classList[0]){
      uploadImage[i].classList.add("hide-frame")
    }secondImg
  }
});

var gray_image;

function uploadFile(e){
  file=document.getElementById(e);
  gray_image = new SimpleImage(file); 
}

function makeGray(e) {
for (var pixel of gray_image.values()){
    var red= pixel.getRed();
    var green= pixel.getGreen();
    var blue= pixel.getBlue();
    average= (red+green+blue)/3;
     pixel.setRed(average);
     pixel.setGreen(average);
     pixel.setBlue(average);
} 
var canvas=document.getElementById(e);
gray_image.drawTo(canvas);
}

let firstCanvas = document.getElementById("first-img-canvas")
firstImg.addEventListener("mouseover",()=>{firstCanvas.classList.toggle("reduce-opacity")})
firstImg.addEventListener("mouseout",()=>{firstCanvas.classList.toggle("reduce-opacity")})
let secondCanvas = document.getElementById("second-img-canvas")
secondImg.addEventListener("mouseover",()=>{secondCanvas.classList.toggle("reduce-opacity")})
secondImg.addEventListener("mouseout",()=>{secondCanvas.classList.toggle("reduce-opacity")})
function sendImage() {
  var formData = new FormData($("#upload-form")[0]);

  $.ajax({
    type: "POST",
    url: "/upload-image",
    data: formData,
    contentType: false,
    cache: false,
    processData: false,
    async: true,
    success: function (data) {
      console.log(data);
    },
  });
}

