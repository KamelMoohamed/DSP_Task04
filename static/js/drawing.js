// Toolbar default values
let isCircleType = true;
let mode = 0;
let isImag1Enabled = true;
let isImag2Enabled = true;
let imag1Type = 0;
let firstImageContent = null;
let secondImageContent = null;
let bothType = false;
let firstCondition = false;
let secondCondition = false;

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
  draw_shapes();
});

let intersectMode = document.getElementsByClassName("intersect");
intersectMode[0].addEventListener("click", () => {
  mode = 1;
  draw_shapes();
});

let diffMode = document.getElementsByClassName("difference");
diffMode[0].addEventListener("click", () => {
  mode = 2;
  draw_shapes();
});

let img1Mag = document.getElementById("img1-mag");
img1Mag.addEventListener("click", () => {
  imag1Type = 0;
  toggle_images();
});

let img1Phase = document.getElementById("img1-phase");
img1Phase.addEventListener("click", () => {
  imag1Type = 1;
  toggle_images();
});

let img2Mag = document.getElementById("img2-mag");
img2Mag.addEventListener("click", () => {
  imag1Type = 1;
  toggle_images();
});

let img2Phase = document.getElementById("img2-phase");
img2Phase.addEventListener("click", () => {
  imag1Type = 0;
  toggle_images();
});

let enable1 = document.getElementById("first-disable");
enable1.addEventListener("click", () => {
  isImag1Enabled = !isImag1Enabled;
});

let enable2 = document.getElementById("second-disable");
enable2.addEventListener("click", () => {
  isImag2Enabled = !isImag2Enabled;
});

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
  closeValue = 10,
  mouseClick = false;

// Point of Mouse Down
let startX, startY;

// Drawing Functions
const drawRect = (shape) => {
  context.fillStyle = "blue";
  context.fillRect(shape.x, shape.y, shape.width, shape.height);
};

const drawEllipse = (shape) => {
  context.fillStyle = "blue";

  context.beginPath();
  context.ellipse(
    shape.x,
    shape.y,
    shape.radius1,
    shape.radius2,
    0,
    0,
    2 * Math.PI
  );
  context.fill();
};
function drawCircle(x, y, radius) {
  context.fillStyle = "yellow";
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
}
function drawHandles(rect) {
  if (rect.type == "rect") {
    drawCircle(rect.x, rect.y, 2);
    drawCircle(rect.x + rect.width, rect.y, 2);
    drawCircle(rect.x + rect.width, rect.y + rect.height, 2);
    drawCircle(rect.x, rect.height + rect.y, 2);
  } else {
    drawCircle(rect.x, rect.y + rect.radius2, 2);
    drawCircle(rect.x, rect.y - rect.radius2, 2);
    drawCircle(rect.x + rect.radius1, rect.y, 2);
    drawCircle(rect.x - rect.radius1, rect.y, 2);
  }
}

const draw_shapes = () => {
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  if (mode == 2) {
    context.globalCompositeOperation = "xor";
    context.globalAlpha = 1;
  } else if (mode == 0) {
    context.globalCompositeOperation = "source-over";
    context.globalAlpha = 0.5;
  }
  for (let shape of shapes) {
    if (shape.type == "rect") {
      drawRect(shape);
    } else {
      drawEllipse(shape);
    }
    if (mode == 1) {
      context.globalCompositeOperation = "lighter";
      context.globalAlpha = 0.4;
    }
  }

  if (currentShapeIndex != null) {
    drawHandles(shapes[currentShapeIndex]);
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
  mouseClick = true;
  mouseDown = true;
  event.preventDefault();

  startX = parseInt(event.clientX - offsetX) * scaleX;
  startY = parseInt(event.clientY - offsetY) * scaleY;

  let index = 0;
  for (let shape of shapes) {
    if (shape.type == "rect") {
      // Handelling rect dragging or resizing
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
    }

    // Handelling ellipse dragging and resizing
    else {
      if (
        checkCloseEnough(startX, shape.x) &&
        (checkCloseEnough(startY, shape.y + shape.radius2) ||
          checkCloseEnough(startY, shape.y - shape.radius2))
      ) {
        currentShapeIndex = index;
        circleMove = true;
        firstCondition = true;
      } else if (
        checkCloseEnough(startY, shape.y) &&
        (checkCloseEnough(startX, shape.x + shape.radius1) ||
          checkCloseEnough(startX, shape.x - shape.radius1))
      ) {
        currentShapeIndex = index;
        circleMove = true;
        secondCondition = true;
      } else if (is_mouse_in_shape(startX, startY, shape)) {
        currentShapeIndex = index;
        isSelected = true;
      }
    }

    index++;
  }
};

let mouse_up = (event) => {
  mouseDown = false;
  mouseClick = false;
  let mouseX = parseInt(event.clientX - offsetX) * scaleX;
  let mouseY = parseInt(event.clientY - offsetY) * scaleY;

  event.preventDefault();
  // Drawing new shape if mouse pos doen't include shapes
  let width = Math.max(startX, mouseX) - Math.min(startX, mouseX);
  let height = Math.max(startY, mouseY) - Math.min(startY, mouseY);
  if (!isSelected && !dragBL && !dragBR && !dragTL && !dragTR && !circleMove) {
    if (width == 0 || height == 0) return;
    let shape = {
      x: Math.min(startX, mouseX),
      y: Math.min(startY, mouseY),
    };
    if (!isCircleType) {
      // Rect drawing
      shape.width = width;
      shape.height = height;
      shape.type = "rect";
      drawRect(shape);
      shapes.push(shape);
    }
    // Ellipse drawing
    else {
      shape.radius1 = width;
      shape.radius2 = height;
      shape.type = "ellipse";
      drawEllipse(shape);
      shapes.push(shape);
    }
  }
  draw_shapes();
  isSelected = false;
  dragBL =
    dragBR =
    dragTL =
    dragTR =
    circleMove =
    firstCondition =
    secondCondition =
      false;
  mix_images();
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
      if (firstCondition) {
        shape.radius2 = mouseY - shape.y;
      } else if (secondCondition);
      {
        shape.radius1 = Math.max(shape.x, mouseX) - Math.min(shape.x, mouseX);
      }
    }
    draw_shapes();
  } else {
    let width = Math.max(startX, mouseX) - Math.min(startX, mouseX);
    let height = Math.max(startY, mouseY) - Math.min(startY, mouseY);
    let shape = {
      x: Math.min(startX, mouseX),
      y: Math.min(startY, mouseY),
    };
    if (!isSelected) {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.save();
      context.beginPath();
      if (!isCircleType) {
        shape.width = width;
        shape.height = height;
        shape.type = "rect";
        draw_shapes();
        drawRect(shape);
      } else {
        shape.radius1 = width;
        shape.radius2 = height;
        shape.type = "ellipse";
        draw_shapes();
        drawEllipse(shape);
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
  if (mouseDown) {
    mouse_up();
  }
};
function change_canvas(className) {
  if (!mouseClick) {
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
}

// Adding Delete Button
const delete_shape = () => {
  shapes.splice(currentShapeIndex, 1);
  currentShapeIndex = null;
  draw_shapes();
};

const get_canvas_dimensions = () => {
  c = document.getElementById("first-img-ft-canvas");
  width = c.width;
  height = c.height;
  return [height, width];
};

var deleteButton = document.getElementsByClassName("delete-btn");
deleteButton[0].addEventListener("click", (event) => {
  event.preventDefault();
  delete_shape();
});

document.addEventListener("keypress", function (event) {
  event.preventDefault();
  const cir = document.getElementsByClassName("cir")[0];
  const rec = document.getElementsByClassName("rec")[0];
  if (event.key == "d") {
    delete_shape();
  } else if (event.key == "c") {
    isCircleType = true;
    if (cir.classList.contains("type")) {
      for (i = 0; i < typeIcons.length; i++) {
        typeIcons[i].classList.remove("selected-type");
      }
      let selectedType = document.querySelector(`.${cir.classList[1]} .icon`);
      selectedType.classList.add("selected-type");
    }
  } else if (event.key == "r") {
    isCircleType = false;
    if (rec.classList.contains("type")) {
      for (i = 0; i < typeIcons.length; i++) {
        typeIcons[i].classList.remove("selected-type");
      }
      let selectedType = document.querySelector(`.${rec.classList[1]} .icon`);
      selectedType.classList.add("selected-type");
    }
  }
});
