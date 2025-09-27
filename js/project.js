const projects = [
    {
        id: 1,
        image: "assets/project_1.jpg",
        title: "Dumbsway Mobile App - 2021",
        time: "12 Jan 2021 - 11 Feb 2021",
        duration: "3 bulan",
        description: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
        icons: ["fa-node-js", "fa-square-js", "fa-react", "fa-laravel"],
        fullDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, at. Atque reprehenderit, cupiditate neque suscipit, alias ex aliquid tenetur animi earum rem maiores culpa aut! Aliquid aliquam corrupti dolore enim deserunt necessitatibus sit culpa suscipit possimus quam! Iure, accusantium ratione fuga quas cum ad reiciendis maiores totam itaque alias commodi vel cupiditate at, fugiat repellendus ullam tempore possimus doloremque. Modi, ea, facere aliquid optio dolore, nam repellat in sed minima et dignissimos qui maiores suscipit? Fugit eum ratione officia aut sed quis cumque, voluptatem deleniti ab recusandae. Quam recusandae sequi beatae explicabo, iusto labore incidunt asperiores ab debitis, distinctio voluptas!"
    },
    {
        id: 2,
        image: "assets/project_2.jpg",
        title: "Dumbsway Mobile App - 2022",
        time: "12 Jan 2022 - 11 Feb 2022",
        duration: "3 bulan",
        description: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
        icons: ["fa-square-js", "fa-react", "fa-laravel"],
        fullDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, at. Atque reprehenderit, cupiditate neque suscipit, alias ex aliquid tenetur animi earum rem maiores culpa aut! Aliquid aliquam corrupti dolore enim deserunt necessitatibus sit culpa suscipit possimus quam! Iure, accusantium ratione fuga quas cum ad reiciendis maiores totam itaque alias commodi vel cupiditate at, fugiat repellendus ullam tempore possimus doloremque. Modi, ea, facere aliquid optio dolore, nam repellat in sed minima et dignissimos qui maiores suscipit? Fugit eum ratione officia aut sed quis cumque, voluptatem deleniti ab recusandae. Quam recusandae sequi beatae explicabo, iusto labore incidunt asperiores ab debitis, distinctio voluptas!"
    },
    {
        id: 3,
        image: "assets/project_3.jpg",
        title: "Dumbsway Mobile App - 2023",
        time: "12 Jan 2023 - 11 Feb 2023",
        duration: "3 bulan",
        description: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
        icons: ["fa-square-js", "fa-react", "fa-laravel"],
        fullDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, at. Atque reprehenderit, cupiditate neque suscipit, alias ex aliquid tenetur animi earum rem maiores culpa aut! Aliquid aliquam corrupti dolore enim deserunt necessitatibus sit culpa suscipit possimus quam! Iure, accusantium ratione fuga quas cum ad reiciendis maiores totam itaque alias commodi vel cupiditate at, fugiat repellendus ullam tempore possimus doloremque. Modi, ea, facere aliquid optio dolore, nam repellat in sed minima et dignissimos qui maiores suscipit? Fugit eum ratione officia aut sed quis cumque, voluptatem deleniti ab recusandae. Quam recusandae sequi beatae explicabo, iusto labore incidunt asperiores ab debitis, distinctio voluptas!"
    },
    {
        id: 4,
        image: "assets/project_4.jpg",
        title: "Dumbsway Website App - 2024",
        time: "12 Jan 2024 - 11 Feb 2024",
        duration: "3 bulan",
        description: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
        icons: ["fa-react", "fa-laravel"],
        fullDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, at. Atque reprehenderit, cupiditate neque suscipit, alias ex aliquid tenetur animi earum rem maiores culpa aut! Aliquid aliquam corrupti dolore enim deserunt necessitatibus sit culpa suscipit possimus quam! Iure, accusantium ratione fuga quas cum ad reiciendis maiores totam itaque alias commodi vel cupiditate at, fugiat repellendus ullam tempore possimus doloremque. Modi, ea, facere aliquid optio dolore, nam repellat in sed minima et dignissimos qui maiores suscipit? Fugit eum ratione officia aut sed quis cumque, voluptatem deleniti ab recusandae. Quam recusandae sequi beatae explicabo, iusto labore incidunt asperiores ab debitis, distinctio voluptas!"
    },
    {
        id: 5,
        image: "assets/project_5.jpg",
        title: "Dumbsway Website App - 2025",
        time: "12 Jan 2025 - 11 Feb 2025",
        duration: "3 bulan",
        description: "Some quick example text to build on the card title and make up the bulk of the card’s content.",
        icons: ["fa-node-js", "fa-square-js", "fa-react", "fa-laravel"],
        fullDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit, at. Atque reprehenderit, cupiditate neque suscipit, alias ex aliquid tenetur animi earum rem maiores culpa aut! Aliquid aliquam corrupti dolore enim deserunt necessitatibus sit culpa suscipit possimus quam! Iure, accusantium ratione fuga quas cum ad reiciendis maiores totam itaque alias commodi vel cupiditate at, fugiat repellendus ullam tempore possimus doloremque. Modi, ea, facere aliquid optio dolore, nam repellat in sed minima et dignissimos qui maiores suscipit? Fugit eum ratione officia aut sed quis cumque, voluptatem deleniti ab recusandae. Quam recusandae sequi beatae explicabo, iusto labore incidunt asperiores ab debitis, distinctio voluptas!"
    },
]

const iconNames = {
    "fa-node-js": "Node Js",
    "fa-square-js": "Next Js",
    "fa-react": "React Js",
    "fa-laravel": "Laravel",
};

const card = document.getElementById("list-project");

projects.forEach(project => {
    card.innerHTML += `
    <div class="col-lg-4 col-md-6 mb-5">
		<div class="card card-effect border-0 shadow">
			<div id="${project.id}" class="card-body">
				<img src="${project.image}" class="card-img-top img-fluid rounded object-fit-cover" style="height: 250px">
				<div class="card-title mt-2">
					<a href="description.html?id=${project.id}" class="fs-5 fw-bold m-0 link-effect">${project.title}</a>
					<small class="text-body-secondary d-block">durasi : ${project.duration}</small>
				</div>
				<p class="card-text">${project.description}</p>
				<div class="d-flex flex-row gap-3">
                    ${project.icons.map(icon => `<div><i class="fa-brands ${icon} fa-xl"></i></div>`).join('')}
				</div>
			</div>
			<div class="card-body">
				<div class="d-flex gap-1 justify-content-center">
					<a href="#" class="btn btn-dark w-50">edit</a>
					<a href="#" class="btn btn-dark w-50">delete</a>
				</div>
			</div>
		</div>
	</div>
    `
});