let showButton = document.getElementById("show-result-btn");
showButton.addEventListener("click", () => {
  let reqBody;
  if (imag1Type == 0) {
    reqBody = {
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
