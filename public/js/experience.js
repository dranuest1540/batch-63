// Preview Image
document.getElementById("inputImage").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById("preview");
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
        }
        reader.readAsDataURL(file);
    }
});

// Dynamic Responsibilites Input in formExperience.hbs
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("responsibility-container");

    // Delegasi event karena tombol dibuat dinamis
    container.addEventListener("click", (e) => {
        if (e.target.closest(".add-responsibility")) {
            const newInput = document.createElement("div");
            newInput.classList.add("input-group", "mb-2");

            newInput.innerHTML = `
        <input type="text" class="form-control shadow" name="responsibilities[]" placeholder="e.g. Conducted system testing" required>
        <button type="button" class="btn btn-danger remove-responsibility">
          <i class="fa-solid fa-minus"></i>
        </button>
      `;
            container.appendChild(newInput);
        }

        if (e.target.closest(".remove-responsibility")) {
            e.target.closest(".input-group").remove();
        }
    });
});

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