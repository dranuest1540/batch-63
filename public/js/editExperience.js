// Preview Image
document.getElementById("inputImage").addEventListener("change", function (e) {
    const file = e.target.files[0];
    const preview = document.getElementById("preview");
    const arrowIcon = document.getElementById("arrow-icon");
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            arrowIcon.src = e.target.result;
            preview.style.display = "block";
            arrowIcon.classList.remove("d-none");
            arrowIcon.classList.add("d-block");
        }
        reader.readAsDataURL(file);
    }
});

// Dynamic Responsibilites Input in formExperience.hbs
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("responsibility-container");

    // 🔹 Fungsi ini ditaruh di sini
    function refreshButtons() {
        const groups = container.querySelectorAll(".input-group");
        groups.forEach((group, index) => {
            // Hapus semua tombol lama
            group.querySelectorAll(".add-responsibility, .remove-responsibility").forEach(btn => btn.remove());

            // Kalau ada lebih dari 1 input, tambahkan tombol minus
            if (groups.length > 1) {
                const removeButton = document.createElement("button");
                removeButton.type = "button";
                removeButton.className = "btn btn-danger remove-responsibility";
                removeButton.innerHTML = `<i class="fa-solid fa-minus"></i>`;
                group.appendChild(removeButton);
            }

            // Tambahkan tombol plus di input terakhir
            if (index === groups.length - 1) {
                const addButton = document.createElement("button");
                addButton.type = "button";
                addButton.className = "btn btn-success add-responsibility";
                addButton.innerHTML = `<i class="fa-solid fa-plus"></i>`;
                group.appendChild(addButton);
            }
        });
    }

    // Jalankan pertama kali untuk setup tombol
    refreshButtons();

    // 🔹 Event handler utama (delegasi klik)
    container.addEventListener("click", (e) => {
        // Tambah input baru
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
            refreshButtons(); // Update tombol setiap kali tambah
        }

        // Hapus input
        if (e.target.closest(".remove-responsibility")) {
            const allInputs = container.querySelectorAll(".input-group");

            if (allInputs.length > 1) {
                e.target.closest(".input-group").remove();
            } else {
                const input = allInputs[0].querySelector("input");
                input.value = "";
            }

            refreshButtons(); // Update tombol setiap kali hapus
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