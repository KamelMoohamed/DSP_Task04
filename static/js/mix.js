let showButton = document.getElementById("show-result-btn");
let canvas_dim = get_canvas_dimensions();
showButton.addEventListener("click", () => {
  let reqBody;
  console.log(canvas_dim);
  if (imag1Type == 0) {
    reqBody = {
      canvas_dim: canvas_dim,
      magnitude: 0,
      mag_shapes: {
        mode: mode,
        shapes: firstShapes,
      },
      phase: 1,
      phase_shapes: {
        mode: mode,
        shapes: secondShapes,
      },
    };
  } else {
    reqBody = {
      canvas_dim: canvas_dim,
      magnitude: 1,
      mag_shapes: {
        mode: mode,
        shapes: secondShapes,
      },
      phase: 0,
      phase_shapes: {
        mode: mode,
        shapes: firstShapes,
      },
    };
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
