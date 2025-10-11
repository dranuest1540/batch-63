// Validasi Bootstrap bawaan
const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
  }

  const checkedBox = document.querySelectorAll(".form-check-input:checked").length;
  const checkValid = document.getElementById("checkbox-validation");

  if (checkedBox === 0) {
    event.preventDefault();
    event.stopPropagation();
    checkValid.style.display = "block";
  } else {
    checkValid.style.display = "none";
  }

  form.classList.add("was-validated");
});

// Preview Image
document.getElementById("inputImage").addEventListener("change", function(e) {
  const file = e.target.files[0];
  const preview = document.getElementById("preview");
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    }
    reader.readAsDataURL(file);
  }
});
