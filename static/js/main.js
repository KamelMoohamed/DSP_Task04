let uploadImage = document.getElementsByClassName("upload-img");
let firstImg = document.getElementById("img1");

let imagesContent = [
  {
    uploaded: false,
  },
  {
    uploaded: false,
  },
];

firstImg.addEventListener("change", (e) => {
  firstDisableBtn.classList.add("show-disable-btn");
  firstCanvas.classList.remove("disabled");
  firstDisableBtn.classList.remove("active");
  sendImage(0);
  uploadFile("img1");
  setTimeout(makeGray.bind(null, "first-img-canvas"), 90);
  for (i = 0; i < uploadImage.length; i++) {
    if (uploadImage[i].classList[1] == firstImg.classList[0]) {
      uploadImage[i].classList.add("hide-frame");
    }
  }
});
let secondImg = document.getElementById("img2");
secondImg.addEventListener("change", (e) => {
  secondDisableBtn.classList.add("show-disable-btn");
  secondCanvas.classList.remove("disabled");
  secondDisableBtn.classList.remove("active");

  sendImage(1);
  uploadFile("img2");
  setTimeout(makeGray.bind(null, "second-img-canvas"), 90);
  for (i = 0; i < uploadImage.length; i++) {
    if (uploadImage[i].classList[1] == secondImg.classList[0]) {
      uploadImage[i].classList.add("hide-frame");
    }
    secondImg;
  }
});

var gray_image;

function uploadFile(e) {
  file = document.getElementById(e);
  gray_image = new SimpleImage(file);
}

function makeGray(e) {
  for (var pixel of gray_image.values()) {
    var red = pixel.getRed();
    var green = pixel.getGreen();
    var blue = pixel.getBlue();
    average = (red + green + blue) / 3;
    pixel.setRed(average);
    pixel.setGreen(average);
    pixel.setBlue(average);
  }
  var canvas = document.getElementById(e);
  gray_image.drawTo(canvas);
}

let firstCanvas = document.getElementById("first-img-canvas");
let firstDisableBtn = document.getElementById("first-disable");
firstImg.addEventListener("mouseover", () => {
  firstCanvas.classList.toggle("reduce-opacity");
  firstDisableBtn.classList.toggle("show-disable-btn");
  firstCanvas.classList.add("reduce-opacity");
});

firstDisableBtn.addEventListener("mouseover", () => {
  firstDisableBtn.classList.toggle("show-disable-btn");
});

firstImg.addEventListener("mouseout", () => {
  firstCanvas.classList.toggle("reduce-opacity");
  firstDisableBtn.classList.toggle("show-disable-btn");
  firstCanvas.classList.remove("reduce-opacity");
});

firstDisableBtn.addEventListener("click", () => {
  firstCanvas.classList.toggle("disabled");
  firstDisableBtn.classList.toggle("active");
});

let secondCanvas = document.getElementById("second-img-canvas");
let secondDisableBtn = document.getElementById("second-disable");
secondImg.addEventListener("mouseover", () => {
  secondCanvas.classList.toggle("reduce-opacity");
  secondDisableBtn.classList.toggle("show-disable-btn");
  secondCanvas.classList.add("reduce-opacity");
});
secondImg.addEventListener("mouseout", () => {
  secondCanvas.classList.toggle("reduce-opacity");
  secondDisableBtn.classList.toggle("show-disable-btn");
  secondCanvas.classList.remove("reduce-opacity");
});

secondDisableBtn.addEventListener("click", () => {
  secondCanvas.classList.toggle("disabled");
  secondDisableBtn.classList.toggle("active");
});

secondDisableBtn.addEventListener("click", () => {
  secondCanvas.classList.toggle("disabled");
  secondDisableBtn.classList.toggle("active");
});

function toggle_images() {
  if (imagesContent[0].uploaded) {
    if (imag1Type == 0) {
      document.getElementsByClassName(
        "fourier1"
      )[0].style.background = `url('static/uploads/${imagesContent[0].mag}') no-repeat center center`;
    } else {
      document.getElementsByClassName(
        "fourier1"
      )[0].style.background = `url('static/uploads/${imagesContent[0].phase}') no-repeat center center`;
    }
  }
  if (imagesContent[1].uploaded) {
    if (imag1Type != 0) {
      document.getElementsByClassName(
        "fourier2"
      )[0].style.background = `url('static/uploads/${imagesContent[1].mag}') no-repeat center center`;
    } else {
      document.getElementsByClassName(
        "fourier2"
      )[0].style.background = `url('static/uploads/${imagesContent[1].phase}') no-repeat center center`;
    }
  }
}

function sendImage(pathParams) {
  var formData = new FormData($(`#upload-form${pathParams}`)[0]);

  $.ajax({
    type: "POST",
    url: `/upload-image/${pathParams}`,
    data: formData,
    contentType: false,
    cache: false,
    processData: false,
    async: true,
    success: function (data) {
      console.log(data);
      if (pathParams == 0) {
        imagesContent[0] = {
          uploaded: true,
          mag: data.path[1],
          phase: data.path[2],
        };
      } else {
        imagesContent[1] = {
          uploaded: true,
          mag: data.path[1],
          phase: data.path[2],
        };
      }
      toggle_images();
    },
  });
}
let typeIcons = document.getElementsByClassName("icon");
let optionIcons = document.getElementsByClassName("img");
let imgIcons = document.getElementsByClassName("img-selection");

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("type")) {
    for (i = 0; i < typeIcons.length; i++) {
      typeIcons[i].classList.remove("selected-type");
    }
    let selectedType = document.querySelector(
      `.${e.target.classList[1]} .icon`
    );
    selectedType.classList.add("selected-type");
  }
  if (e.target.classList.contains("option")) {
    for (i = 0; i < optionIcons.length; i++) {
      optionIcons[i].classList.remove("selected-option");
    }
    e.target.children[1].classList.add("selected-option");
  }
  if (e.target.classList.contains("img-selection")) {
    for (i = 0; i < imgIcons.length; i++) {
      imgIcons[i].classList.remove("selected-img");
    }
    for (
      i = 0;
      i < document.getElementsByClassName(`${e.target.classList[0]}`).length;
      i++
    ) {
      document
        .getElementsByClassName(`${e.target.classList[0]}`)
        [i].classList.add("selected-img");
    }
  }
});
