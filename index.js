import express from 'express'
const app = express()
const port = 3000

app.set('view engine', 'hbs');
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"))
app.use("/views", express.static("src/views"))
app.use(express.urlencoded({ extended: false })) // Parsing Express

app.get('/', index)
app.get('/contact', contact)
app.post('/contact', postContact)
app.get('/project', project)
app.get('/description', description)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// Deklarasi Function
function index(req, res) {
    res.render("index");
}

function contact(req, res) {
    res.render("contact");
}

let dataUser = [];
function postContact(req, res) {
    let dataContact = {
        inputName: req.body.inputName,
        inputEmail: req.body.inputEmail, 
        inputNumber: req.body.inputNumber,
        inputSubject: req.body.inputSubject,
        inputMessage: req.body.inputMessage
    };
    dataUser.push(dataContact);
    console.log(dataUser);
}

function project(req, res) {
    res.render("project");
}

function description(req, res) {
    res.render("description");
}