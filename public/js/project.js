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

// Link Repository and Demo Condition
document.addEventListener("DOMContentLoaded", function () {
    const repositorySelect = document.getElementById("repository");
    const demoSelect = document.getElementById("demo");
    const linkRepoInput = document.getElementById("linkrepository");
    const linkDemoInput = document.getElementById("linkdemo");

    // Fungsi toggle untuk repository
    function toggleRepoLink() {
        if (repositorySelect.value === "public") {
            linkRepoInput.parentElement.style.display = "block";
            linkRepoInput.setAttribute("required", "required");
        } else {
            linkRepoInput.parentElement.style.display = "none";
            linkRepoInput.removeAttribute("required");
            linkRepoInput.value = ""; // reset input kalau disembunyikan
        }
    }

    // Fungsi toggle untuk demo
    function toggleDemoLink() {
        if (demoSelect.value === "available") {
            linkDemoInput.parentElement.style.display = "block";
            linkDemoInput.setAttribute("required", "required");
        } else {
            linkDemoInput.parentElement.style.display = "none";
            linkDemoInput.removeAttribute("required");
            linkDemoInput.value = "";
        }
    }

    // Jalankan saat halaman load
    toggleRepoLink();
    toggleDemoLink();

    // Jalankan tiap kali select berubah
    repositorySelect.addEventListener("change", toggleRepoLink);
    demoSelect.addEventListener("change", toggleDemoLink);
});
