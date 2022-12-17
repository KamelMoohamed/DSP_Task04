let canvas = document.querySelector("canvas");
let context = canvas.getContext("2d");

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let shapes = [
  { x: 100, y: 100, height: 100, width: 100, color: "blue", type: "rect" },
];
let currentShapeIndex = null;
let isSelected = false;
let startX, startY;
let mode = document.getElementById("switch");

const draw_shapes = () => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  for (let shape of shapes) {
    if (shape.type == "rect") {
      drawRect(shape);
    } else {
      drawEllipse(shape);
    }
  }
};

const drawRect = (shape) => {
  context.fillStyle = shape.color;
  context.fillRect(shape.x, shape.y, shape.width, shape.height);
};

const drawEllipse = (shape) => {
  context.fillStyle = shape.color;
  context.ellipse(shape.x, shape.y, shape.radius1, shape.radius2);
};

const mouse_down = (event) => {
  event.preventDefault();

  startX = parseInt(event.clientX);
  startY = parseInt(event.clientY);

  let index = 0;
  for (let shape of shapes) {
    if (is_mouse_in_shape(startX, startY, shape)) {
      currentShapeIndex = index;
      isSelected = true;
    }
    index++;
  }
};

const is_mouse_in_shape = (x, y, shape) => {
  if (shape.type == "rect") {
    let left = shape.x;
    let right = shape.x + shape.width;
    let top = shape.y;
    let bottom = shape.y + shape.height;

    if (x > left && x < right && y > top && y < bottom) {
      return true;
    }
    return false;
  } else {
    var point =
      Math.pow(x - shape.x, 2) / Math.pow(shape.radius1, 2) +
      Math.pow(y - shape.y, 2) / Math.pow(shape.radius2, 2);

    return point > 1;
  }
};

let mouse_up = (event) => {
  event.preventDefault();
  if (!isSelected) {
    let mouseX = parseInt(event.clientX);
    let mouseY = parseInt(event.clientY);
    let shape = {
      x: startX,
      y: startY,
      width: mouseX - startX,
      height: mouseY - startY,
      type: "rect",
    };
    drawRect(shape);
    shapes.push(shape);
  }
};

let mouse_out = (event) => {
  event.preventDefault();
  isSelected = false;
};

let mouse_move = (event) => {
  event.preventDefault();
  if (!isSelected) {
    if (mode == "rect") {
      let mouseX = parseInt(event.clientX);
      let mouseY = parseInt(event.clientY);
      let shape = {
        x: startX,
        y: startY,
        width: mouseX - startX,
        height: mouseY - startY,
        type: "rect",
      };
      drawRect(shape);
    } else {
      // TODO: DRAWING ELLIPSE
    }
  } else {
    let mouseX = parseInt(event.clientX);
    let mouseY = parseInt(event.clientY);

    let dx = mouseX - startX;
    let dy = mouseY - startY;

    let currentShape = shapes[currentShapeIndex];
    currentShape.x += dx;
    currentShape.y += dy;

    draw_shapes();

    startX = mouseX;
    startY = mouseY;
  }
};

canvas.onmouseup = mouse_up;
canvas.onmousedown = mouse_down;
canvas.onmousemove = mouse_move;
canvas.onmouseout = mouse_out;
