fetch("../../views/layouts/navbar.hbs")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;
  });
