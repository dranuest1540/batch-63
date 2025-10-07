import express from 'express'
import pool from "./src/config/database.js";

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

app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database connected! Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

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

    res.redirect("/contact");
}

function project(req, res) {
    res.render("project");
}

function description(req, res) {
    res.render("description");
}