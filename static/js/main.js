// let realCanvasWidth, realCanvasHeight;

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
  bothBtns.style.display = "flex";
  firstDisableBtn.classList.add("show-disable-btn");
  firstCanvas.classList.remove("disabled");
  firstDisableBtn.classList.remove("active");
  document.querySelector(".uni1").classList.remove("uniform-show");

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
  bothBtns.style.display = "flex";
  secondDisableBtn.classList.add("show-disable-btn");
  secondCanvas.classList.remove("disabled");
  secondDisableBtn.classList.remove("active");
  document.querySelector(".uni2").classList.remove("uniform-show");

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
firstDisableBtn.addEventListener("click", () => {
  firstCanvas.classList.toggle("disabled");
  firstDisableBtn.classList.toggle("active");
  document.querySelector(".uni1").classList.toggle("uniform-show");
});

let secondCanvas = document.getElementById("second-img-canvas");
let secondDisableBtn = document.getElementById("second-disable");

secondDisableBtn.addEventListener("click", () => {
  secondCanvas.classList.toggle("disabled");
  secondDisableBtn.classList.toggle("active");
  document.querySelector(".uni2").classList.toggle("uniform-show");
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

var firstFtCanvas = document.getElementById("first-img-ft-canvas");
var secondFtCanvas = document.getElementById("second-img-ft-canvas");
let canvContainer = document.querySelector(".canv-cont");

let first_img = false;
let sec_img = false;

function sendImage(pathParams) {
  // if (first_img && sec_img) {
  //   $.ajax({
  //     type: "POST",
  //     url: `/delete-image`,
  //     contentType: false,
  //     cache: false,
  //     processData: false,
  //     async: true,
  //   });
  // }
  // if (pathParams == 0) {
  //   first_img = !first_img;
  // } else {
  //   sec_img = !sec_img;
  // }
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
      if (firstCanvas.width <= firstCanvas.height) {
        firstFtCanvas.style.height = "100%";
        firstFtCanvas.style.width = `${
          firstCanvas.width * (canvContainer.clientHeight / firstCanvas.height)
        }px`;
      } else {
        firstFtCanvas.style.width = "100%";
        firstFtCanvas.style.height = `${
          firstCanvas.height * (canvContainer.clientWidth / firstCanvas.width)
        }px`;
      }
      if (secondCanvas.width <= secondCanvas.height) {
        secondFtCanvas.style.height = "100%";
        secondFtCanvas.style.width = `${
          secondCanvas.width *
          (canvContainer.clientHeight / secondCanvas.height)
        }px`;
      } else {
        secondFtCanvas.style.width = "100%";
        secondFtCanvas.style.height = `${
          secondCanvas.height * (canvContainer.clientWidth / secondCanvas.width)
        }px`;
      }
      // realCanvasHeight = firstFtCanvas.height;
      // realCanvasWidth = firstFtCanvas.width;
      // console.log(realCanvasHeight);
      // console.log(realCanvasWidth);

      if (bothType) {
        imagesContent[0] = {
          uploaded: true,
          mag: data.path[1],
          phase: data.path[2],
        };
        imagesContent[1] = {
          uploaded: true,
          mag: data.path[1],
          phase: data.path[2],
        };
      } else if (pathParams == 0) {
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

function editImage(pathParams) {
  $.ajax({
    type: "POST",
    url: `/edit-image/${pathParams}`,
    contentType: false,
    cache: false,
    processData: false,
    async: true,
    success: function (data) {
      console.log("SUCCESS");
    },
  });
}

let bothBtns = document.getElementById("copy-img");
bothBtns.addEventListener("click", () => {
  console.log("$$$$$$$$$$$$$$");
  if (firstImg.value) {
    secondDisableBtn.classList.add("show-disable-btn");
    secondCanvas.classList.remove("disabled");
    secondDisableBtn.classList.remove("active");
    var canvas2 = document.getElementById("second-img-canvas");
    gray_image.drawTo(canvas2);
    for (i = 0; i < uploadImage.length; i++) {
      if (uploadImage[i].classList[1] == secondImg.classList[0]) {
        uploadImage[i].classList.add("hide-frame");
      }
    }
    imagesContent[1] = imagesContent[0];
    console.log(imagesContent);
    toggle_images();
    editImage(0);
    if (secondCanvas.width <= secondCanvas.height) {
      secondFtCanvas.style.height = "100%";
      secondFtCanvas.style.width = `${
        secondCanvas.width * (canvContainer.clientHeight / secondCanvas.height)
      }px`;
    } else {
      secondFtCanvas.style.width = "100%";
      secondFtCanvas.style.height = `${
        secondCanvas.height * (canvContainer.clientWidth / secondCanvas.width)
      }px`;
    }
  } else if (secondImg.value) {
    firstDisableBtn.classList.add("show-disable-btn");
    firstCanvas.classList.remove("disabled");
    firstDisableBtn.classList.remove("active");
    var canvas1 = document.getElementById("first-img-canvas");
    gray_image.drawTo(canvas1);
    for (i = 0; i < uploadImage.length; i++) {
      if (uploadImage[i].classList[1] == firstImg.classList[0]) {
        uploadImage[i].classList.add("hide-frame");
      }
    }
    imagesContent[0] = imagesContent[1];
    toggle_images();
    editImage(1);
    if (firstCanvas.width <= firstCanvas.height) {
      firstFtCanvas.style.height = "100%";
      firstFtCanvas.style.width = `${
        firstCanvas.width * (canvContainer.clientHeight / firstCanvas.height)
      }px`;
    } else {
      firstFtCanvas.style.width = "100%";
      firstFtCanvas.style.height = `${
        firstCanvas.height * (canvContainer.clientWidth / firstCanvas.width)
      }px`;
    }
  }
});
