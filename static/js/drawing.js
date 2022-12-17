// Toolbar default values
let isCircleType = true;
let mode = 0;
let isImag1Enabled = true;
let isImag2Enabled = true;
let imag1Type = 0;
let firstImageContent = null;
let secondImageContent = null;

// Toolbar event handling
let circleType = document.getElementsByClassName("cir");
circleType[0].addEventListener("click", () => {
  isCircleType = true;
});

let rectType = document.getElementsByClassName("rec");
rectType[0].addEventListener("click", () => {
  isCircleType = false;
});

let allMode = document.getElementsByClassName("all");
allMode[0].addEventListener("click", () => {
  mode = 0;
});

let intersectMode = document.getElementsByClassName("intersect");
intersectMode[0].addEventListener("click", () => {
  mode = 1;
});

let diffMode = document.getElementsByClassName("difference");
diffMode[0].addEventListener("click", () => {
  mode = 2;
});

// TODO: ADDING Listeners

// Handling Mouse Click on canvas
let canvas,
  context,
  dimensions,
  offsetX,
  offsetY,
  canvasWidth,
  canvasHeight,
  scaleX,
  scaleY;

const canvas1 = document.getElementById("first-img-ft-canvas");
canvas1.addEventListener("mouseover", () => {
  change_canvas("first");
});

const canvas2 = document.getElementById("second-img-ft-canvas");
canvas2.addEventListener("mouseover", () => {
  change_canvas("second");
});

// Drawing Default Values
let shapes = [],
  firstShapes = [],
  secondShapes = [],
  isFirst = true,
  currentShapeIndex = null,
  isSelected = false,
  mouseDown = false,
  dragTL = false,
  dragBL = false,
  dragTR = false,
  dragBR = false,
  circleMove = false,
  closeValue = 10;

// Point of Mouse Down
let startX, startY;

// Drawing Functions
const drawRect = (shape) => {
  context.fillRect(shape.x, shape.y, shape.width, shape.height);
};

const drawEllipse = (shape) => {
  // TODO: DRAW ELLIPSE
};

const draw_shapes = () => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  if (firstImageContent != null) {
    if (imag1Type == 0) {
      document.getElementsByClassName(
        "fourier1"
      )[0].style.background = `url('static/uploads/${firstImageContent.mag}') no-repeat center center`;
    } else {
      document.getElementsByClassName(
        "fourier1"
      )[0].style.background = `url('static/uploads/${firstImageContent.phase}') no-repeat center center`;
    }
  }

  if (secondImageContent != null) {
    if (imag1Type != 0) {
      document.getElementsByClassName(
        "fourier2"
      )[0].style.background = `url('static/uploads/${secondImageContent.mag}') no-repeat right top`;
    } else {
      document.getElementsByClassName(
        "fourier2"
      )[0].style.background = `url('static/uploads/${secondImageContent.phase}') no-repeat right top`;
    }
  }

  // TODO: DRAWING MODES
  for (let shape of shapes) {
    if (mode == 1) {
      context.globalCompositeOperation = "xor";
    }
    if (shape.type == "rect") {
      drawRect(shape);
    } else {
      drawEllipse(shape);
    }
  }
};

// Helper Checks
function checkCloseEnough(p1, p2) {
  return Math.abs(p1 - p2) < closeValue;
}

function calculate_circle_distance(x, y, shape) {
  return (
    Math.pow(x - shape.x, 2) / Math.pow(shape.radius1, 2) +
    Math.pow(y - shape.y, 2) / Math.pow(shape.radius2, 2)
  );
}

const is_mouse_in_shape = (x, y, shape) => {
  if (shape.type == "rect") {
    let left = shape.x;
    let right = shape.x + shape.width;
    let top = shape.y;
    let bottom = shape.y + shape.height;

    if (x >= left && x <= right && y >= top && y <= bottom) {
      return true;
    }
    return false;
  } else {
    var point = calculate_circle_distance(x, y, shape);
    return point < 1;
  }
};

// Mouse Clicks Handling
const mouse_down = (event) => {
  mouseDown = true;
  event.preventDefault();

  startX = parseInt(event.clientX - offsetX) * scaleX;
  startY = parseInt(event.clientY - offsetY) * scaleY;

  let index = 0;
  for (let shape of shapes) {
    if (shape.type == "rect") {
      if (
        checkCloseEnough(startX, shape.x) &&
        checkCloseEnough(startY, shape.y)
      ) {
        currentShapeIndex = index;
        dragTL = true;
      }
      // 2. top right
      else if (
        checkCloseEnough(startX, shape.x + shape.width) &&
        checkCloseEnough(startY, shape.y)
      ) {
        currentShapeIndex = index;
        dragTR = true;
      }
      // 3. bottom left
      else if (
        checkCloseEnough(startX, shape.x) &&
        checkCloseEnough(startY, shape.y + shape.height)
      ) {
        currentShapeIndex = index;
        dragBL = true;
      }
      // 4. bottom right
      else if (
        checkCloseEnough(startX, shape.x + shape.width) &&
        checkCloseEnough(startY, shape.y + shape.height)
      ) {
        currentShapeIndex = index;
        dragBR = true;
      } else if (is_mouse_in_shape(startX, startY, shape)) {
        currentShapeIndex = index;
        isSelected = true;
      }
    } else {
      // TODO: CALCULATE Circle Distance
    }

    index++;
  }
};

let mouse_up = (event) => {
  mouseDown = false;
  let mouseX = parseInt(event.clientX - offsetX) * scaleX;
  let mouseY = parseInt(event.clientY - offsetY) * scaleY;

  event.preventDefault();
  if (!isSelected && !dragBL && !dragBR && !dragTL && !dragTR) {
    if (!isCircleType) {
      if (
        Math.max(startX, mouseX) - Math.min(startX, mouseX) == 0 ||
        Math.max(startY, mouseY) - Math.min(startY, mouseY) == 0
      ) {
        return;
      }
      let shape = {
        x: Math.min(startX, mouseX),
        y: Math.min(startY, mouseY),
        width: Math.max(startX, mouseX) - Math.min(startX, mouseX),
        height: Math.max(startY, mouseY) - Math.min(startY, mouseY),
        type: "rect",
      };
      drawRect(shape);
      shapes.push(shape);
    } else {
      // TODO: Draw Circle
    }
  }
  draw_shapes();
  isSelected = false;
  dragBL = dragBR = dragTL = dragTR = circleMove = false;
};

let mouse_move = (event) => {
  event.preventDefault();
  let mouseX = parseInt(event.clientX - offsetX) * scaleX;
  let mouseY = parseInt(event.clientY - offsetY) * scaleY;

  if (!mouseDown) {
    return;
  }

  if (dragBL || dragBR || dragTL || dragTR || circleMove) {
    let shape = shapes[currentShapeIndex];
    if (dragTL) {
      shape.width += shape.x - mouseX;
      shape.height += shape.y - mouseY;
      shape.x = mouseX;
      shape.y = mouseY;
    } else if (dragTR) {
      shape.width = Math.abs(shape.x - mouseX);
      shape.height += shape.y - mouseY;
      shape.y = mouseY;
    } else if (dragBL) {
      shape.width += shape.x - mouseX;
      shape.height = Math.abs(shape.y - mouseY);
      shape.x = mouseX;
    } else if (dragBR) {
      shape.width = Math.abs(shape.x - mouseX);
      shape.height = Math.abs(shape.y - mouseY);
    } else if (circleMove) {
      shape.width = mouseX;
      shape.height = mouseY;
    }
    draw_shapes();
  } else {
    if (!isSelected) {
      if (!isCircleType) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.save();
        context.beginPath();

        let shape = {
          x: Math.min(startX, mouseX),
          y: Math.min(startY, mouseY),
          width: Math.max(startX, mouseX) - Math.min(startX, mouseX),
          height: Math.max(startY, mouseY) - Math.min(startY, mouseY),
          type: "rect",
        };
        draw_shapes();
        drawRect(shape);
      } else {
        // TODO: CIRCLE MOVE
      }
    } else {
      let dx = mouseX - startX;
      let dy = mouseY - startY;

      let currentShape = shapes[currentShapeIndex];
      currentShape.x += dx;
      currentShape.y += dy;

      startX = mouseX;
      startY = mouseY;
      draw_shapes();
    }
  }
};

let mouse_out = (event) => {
  event.preventDefault();
  isSelected = false;
};
function change_canvas(className) {
  canvas = document.getElementById(`${className}-img-ft-canvas`);
  context = canvas.getContext("2d");

  dimensions = canvas.getBoundingClientRect();
  offsetX = dimensions.left;
  offsetY = dimensions.top;

  canvasWidth = canvas.width;
  canvasHeight = canvas.height;

  scaleX = canvas.width / dimensions.width;
  scaleY = canvas.height / dimensions.height;

  if (className == "first" && !isFirst) {
    secondShapes = shapes;
    shapes = firstShapes;
    isFirst = true;
  }

  if (className == "second" && isFirst) {
    firstShapes = shapes;
    shapes = secondShapes;
    isFirst = false;
  }

  canvas.onmouseup = mouse_up;
  canvas.onmousedown = mouse_down;
  canvas.onmousemove = mouse_move;
  canvas.onmouseout = mouse_out;
}

// Adding Delete Button
const delete_shape = () => {
  // if (currentShapeIndex != null) {
  shapes.splice(currentShapeIndex, 1);
  currentShapeIndex = null;
  // }
  draw_shapes();
};

// TODO: ADD Delete Code
