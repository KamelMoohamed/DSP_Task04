let showButton = document.getElementById("show-result-btn");
let canvas_dim = get_canvas_dimensions();
showButton.addEventListener("click", () => {
  let reqBody;
  if (imag1Type == 0) {
    reqBody = {
      canvas_dim: canvas_dim,
      mag_shapes: {
        mode: mode,
        shapes: firstShapes,
      },
      phase_shapes: {
        mode: mode,
        shapes: secondShapes,
      },
    };
    if (isImag1Enabled) {
      reqBody = Object.assign(reqBody, { magnitude: 0 });
    } else {
      reqBody = Object.assign(reqBody, { magnitude: "empty" });
    }

    if (isImag2Enabled) {
      reqBody = Object.assign(reqBody, { phase: 1 });
    } else {
      reqBody = Object.assign(reqBody, { phase: "empty" });
    }
  } else {
    reqBody = {
      canvas_dim: canvas_dim,
      mag_shapes: {
        mode: mode,
        shapes: secondShapes,
      },
      phase_shapes: {
        mode: mode,
        shapes: firstShapes,
      },
    };

    if (isImag1Enabled) {
      reqBody = Object.assign(reqBody, { phase: 0 });
    } else {
      reqBody = Object.assign(reqBody, { phase: "empty" });
    }

    if (isImag2Enabled) {
      reqBody = Object.assign(reqBody, { magnitude: 1 });
    } else {
      reqBody = Object.assign(reqBody, { magnitude: "empty" });
    }
  }
  console.log(reqBody);

  $.ajax({
    type: "POST",
    url: `/mix-image`,
    data: JSON.stringify(reqBody),
    contentType: "application/json; charset=utf-8",
    cache: false,
    processData: false,
    async: true,
    success: function (data) {
      console.log(data);
      document.getElementsByClassName(
        "output-canvas"
      )[0].style.background = `url('${data.path}') no-repeat center center`;
    },
  });
});
