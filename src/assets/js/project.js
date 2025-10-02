let projects = JSON.parse(localStorage.getItem("projects")) || [];

const iconNames = {
    "Node Js": "fa-node-js",
    "Next Js": "fa-square-js",
    "React Js": "fa-react",
    "Laravel": "fa-laravel",
};

const card = document.getElementById("list-project");
const form = document.querySelector("form");

function renderProjects() {
    card.innerHTML = "";
    projects.forEach(project => {
        card.innerHTML += `
        <div class="col-lg-4 col-md-6 mb-5">
            <div class="card card-effect border-0 shadow">
                <div id="${project.id}" class="card-body">
                    <img src="${project.image}" class="card-img-top img-fluid rounded object-fit-cover" style="height: 250px">
                    <div class="card-title mt-2">
                        <a href="/description?id=${project.id}" class="fs-5 fw-bold m-0 link-effect">${project.title}</a>
                        <small class="text-body-secondary d-block">durasi : ${project.duration}</small>
                    </div>
                    <p class="card-text card-truncate">${project.description}</p>
                    <div class="d-flex flex-row gap-3">
                        ${project.icons.map(icon => `<div><i class="fa-brands ${icon} fa-xl"></i></div>`).join('')}
                    </div>
                </div>
                <div class="card-body">
                    <div class="d-flex gap-1 justify-content-center">
                        <a href="#" class="btn btn-dark w-50">edit</a>
                        <button data-id="${project.id}" class="btn btn-dark w-50 delete-btn">delete</button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            deleteProject(id);
        });
    });
}

// Delete Button
function deleteProject(id) {
    projects = projects.filter(p => p.id != id);
    localStorage.setItem("projects", JSON.stringify(projects));
    renderProjects();
}

renderProjects();

// Form
form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Validation
    let valid = true;

    if (!form.checkValidity()) {
        valid = false;
    }

    const checkedBox = document.querySelectorAll(".form-check-input:checked").length;
    const checkValid =document.getElementById("checkbox-validation");
    if(checkedBox === 0) {
        e.stopPropagation()
        checkValid.style.display = "block";
    } else {
        checkValid.style.display = "none";
    }

    if (!valid) {
        e.stopPropagation();
        form.classList.add("was-validated");
        return;
    }

    const imageFile = document.getElementById("inputImage").files[0];

    if(imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveProject(e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveProject("../images/default.jpg");
    }
});

function saveProject(imagePath) {
    const projectName = document.getElementById("inputProjectName").value;
    const startDate = document.getElementById("inputStartDate").value;
    const endDate = document.getElementById("inputEndDate").value;
    const description = document.getElementById("inputDescription").value;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const duration = `${diffMonths} bulan`;

    const checkBox = Array.from(document.querySelectorAll(".form-check-input:checked")).map(input => iconNames[input.value]);

    const newProject = {
        id: Date.now(),
        image: imagePath,
        title: projectName,
        time: `${startDate} - ${endDate}`,
        duration,
        description,
        icons: checkBox,
    };

    // console.log(newProject);

    projects.push(newProject);
    localStorage.setItem("projects", JSON.stringify(projects));

    renderProjects();
    form.reset();
    form.classList.remove("was-validated");
}