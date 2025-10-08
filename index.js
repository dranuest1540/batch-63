import express from 'express';
import hbs from 'hbs';
import pool from "./src/config/database.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import moment from 'moment';

const app = express();
const port = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/assets/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.set('view engine', 'hbs'); // HBS Rendering
app.set("views", "src/views");

hbs.registerPartials("src/views/partials");

app.use("/assets", express.static("src/assets"))
app.use("/views", express.static("src/views"))
app.use(express.urlencoded({ extended: false })) // Parsing Express in Contact.hbs

// Halaman Dashboard
app.get('/', (req, res) => {
    res.render("index", {
       layout: "layouts/app",
       title: "Dashboard",
       css: "../assets/css/style.css",
       js: ""
    });
});

// Halaman Contact
app.get('/contact', (req, res) => {
    res.render("contact", {
        layout: "layouts/app",
       title: "Contact",
       css: "../assets/css/style.css",
       js: ""
    });
});

app.post('/contact/store', (req, res) => {
    let dataUser = [];
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
})

// Halaman Project
app.get('/project', async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM project");

        res.render("project", {
            layout: "layouts/app",
            title: "Project",
            css: "../assets/css/style.css",
            js: "../assets/js/project.js",
            projects: result.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed read data project");
    }
});

app.post('/project/store', upload.single("project_image"), async (req, res) => {
    try {
        const {project_name, project_start, project_end, project_description, project_technologies} = req.body;
        const image = req.file.filename;

        const checkboxTech = Array.isArray(project_technologies) ? project_technologies : [project_technologies];

        await pool.query(
            "INSERT INTO project (project_name, project_start, project_end, project_description, project_technologies, project_image) VALUES ($1, $2, $3, $4, $5, $6)",
            [project_name, project_start, project_end, project_description, checkboxTech, image]
        );
        res.redirect('/project');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error inserting project");
    }
});

app.get('/project/destroy/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT project_image FROM project WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            console.log("Project not found!");
            return res.status(404).send("Project not found!");
        }

        const imageFileName = result.rows[0].project_image;
        const imagePath = path.join("src", "assets", "uploads", imageFileName);

        await pool.query("DELETE FROM project WHERE id = $1", [id]);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image file: ${imageFileName}`);
        } else {
            console.log(`Image file not found: ${imageFileName}`);
        }
        res.redirect('/project');
    } catch(err) {
        console.error("Failed destroy project: ", err);
        res.status(500).send("Failed destroy project");
    }
});

hbs.registerHelper('projectDateCalc', function (project_start, project_end) { // hbs date project helper
    const start = new Date(project_start);
    const end = new Date(project_end);
    const diff = Math.abs(end - start);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    return `${months} bulan`;
});

hbs.registerHelper('splitTech', function (techString) { // hbs checkbox project helper
    if (Array.isArray(techString)) return techString; 
    if (typeof techString === 'string') return techString.split(',').map(t => t.trim());
    return [];
});

hbs.registerHelper('getIcon', function (tech) { // hbs icon project helper
    const iconNames = {
        "Node Js": "fa-node-js",
        "Next Js": "fa-square-js",
        "React Js": "fa-react",
        "Laravel": "fa-laravel",
    };
    return iconNames[tech] || "fa-code";
});

// Halaman Description
app.get('/description', async (req, res) => {
    try {
        const id = req.query.id;

        if(!id) {
            return res.status(400).send("Id not found");
        }
        const result = await pool.query("SELECT * FROM project WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Project not found");
        }

        const project = result.rows[0];

        res.render("description", {
            layout: "layouts/app",
            title: project.project_name,
            css: "../assets/css/style.css",
            js: "",
            project
        });
    } catch (err) {
        console.error("Error loading project description: ", err);
        res.status(500).send("Failed to load project description");
    }
});

hbs.registerHelper('formatDate', function (date) { // hbs format-date description helper
    if (!date) return "";
    return moment(date).format("DD MMM YYYY")
});

// Test Route
app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Database connected! Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Database connection failed");
  }
});

// Connection Localhost
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})