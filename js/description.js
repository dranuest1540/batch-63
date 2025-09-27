const params = new URLSearchParams(window.location.search);
const projectId = params.get("id");
const project = projects.find(p => p.id == projectId);

if (project) {
    document.getElementById("project-detail").innerHTML = `
        <h2 class="pt-5 mb-4 fw-bold text-center">${project.title}</h2>
        <div class="container px-5">
            <div class="row my-3">
                <div class="col-lg-7 pe-3">
                    <img src="${project.image}" class="img-fluid w-100 object-fit-cover" style="max-height: 450px;">
                </div>
                <div class="col-lg-5 ps-3">
                    <p class="fs-3 fw-medium">Duration</p>
                    <p class="fs-4"><i class="fa-solid fa-calendar-days"></i> ${project.time}</p>
                    <p class="fs-4"><i class="fa-solid fa-clock"></i> ${project.duration}</p>
                    <p class="fs-3 fw-medium mt-5">Technologies</p>
                    <div class="row">
                        ${project.icons.map(icon => `
                            <p class="fs-4 col-sm-6">
                                <i class="fa-brands ${icon} fa-xl"></i>
                                ${iconNames[icon] || icon}
                            </p>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="my-5">
                <p class="fs-5" style="text-align: justify;">${project.fullDescription}</p>
            </div>
        </div>
    `;
} else {
    document.getElementById("project-detail").innerHTML = `<h2 class="text-center pt-5">Project not found!</h2>`;
}
