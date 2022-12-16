let uploadedFile = document.getElementById("img");
uploadedFile.addEventListener("change", () => {
  sendImage();
});

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
