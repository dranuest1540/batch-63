import express from 'express';
import hbs from 'hbs';
import pool from "./src/config/database.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import bcrypt from 'bcrypt';
import flash from 'express-flash';
import session from 'express-session';
import {guest, auth} from "./src/middleware/auth.js";

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

app.use(session({ // Menambahkan sesi middleware
    secret: 'secretSession',
    resave: false,
    saveUninitialized: true,
})); 

app.use(flash()); // Menggunakan flash notification
app.use((req, res, next) => { // Middleware session to auth navigation
    res.locals.user = req.session.user;
    next();
});

hbs.registerHelper('eq', function(a, b) { // Mencocokan url di navbar
    return a === b;
});

// Halaman Dashboard
app.get('/', auth, (req, res) => {
    let userData;
    if (req.session.user) {
        userData = {
            name: req.session.user.name,
            email: req.session.user.email,
        }
    };

    res.render("index", {
       layout: "layouts/app",
       title: "Dashboard",
       css: "../assets/css/style.css",
       js: "../assets/js/script.js",
       user: userData,
       activePage: "home",
    });
});

// Halaman Contact
app.get('/contact', auth, (req, res) => {
    res.render("contact", {
        layout: "layouts/app",
       title: "Contact",
       css: "../assets/css/style.css",
       js: "",
       activePage: "contact",
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
app.get('/project', auth, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM project");

        res.render("project", {
            layout: "layouts/app",
            title: "Project",
            css: "../assets/css/style.css",
            js: "../assets/js/project.js",
            projects: result.rows,
            activePage: "project",
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
app.get('/description', auth, async (req, res) => {
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
            project,
            activePage: "project",
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

// Halaman Edit Project
app.get('/project/edit/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT * FROM project WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Project not found");
        }

        const project = result.rows[0];

        res.render("edit-project", {
            layout: "layouts/app",
            title: "Edit Project",
            css: "/assets/css/style.css",
            js: "",
            project,
            activePage: "project",
        });
    } catch (err) {
        console.error("Error loading edit page: ", err);
        res.status(500).send("Failed to load edit page");
    }
});

hbs.registerHelper('includes', function (array, value) { // hbs checbox condition project helper
    if (!Array.isArray(array)) return false;
    return array.includes(value);
});

app.post('/project/update/:id', upload.single('project_image'), async (req, res) => {
    try {
        const id = req.params.id;
        const { project_name, project_start, project_end, project_description, project_technologies } = req.body;
        const checkboxTech = Array.isArray(project_technologies) ? project_technologies : [project_technologies];

        const oldProject = await pool.query("SELECT project_image FROM project WHERE id = $1", [id]);
        if (oldProject.rows.length === 0) {
            return res.status(404).send("Project not found");
        }

        let imageFileName = oldProject.rows[0].project_image;

        if (req.file) {
            const newImage = req.file.filename;
            const oldImagePath = path.join("src", "assets", "uploads", imageFileName);
            imageFileName = newImage;

            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        await pool.query(
            `UPDATE project SET project_name = $1, project_start = $2, project_end = $3, project_description = $4, project_technologies = $5, project_image = $6 WHERE id = $7`,
            [project_name, project_start, project_end, project_description, checkboxTech, imageFileName, id]
        );

        res.redirect('/project');
    } catch (error) {
        console.error("Error updating project: ", err);
        res.status(500).send("Failed to update project");
    }
});

hbs.registerHelper('formatDateReset', function (date) {
    if (!date) return "";
    return moment(date).format("YYYY-MM-DD");
});

// Halaman Login
app.get('/login', guest, (req, res) => {
    res.render('auth/login', {
        layout: "layouts/app",
        title: "Login",
        css: "../assets/css/auth.css",
        js: "",
        message: req.flash("error"),
        success: req.flash("success"),
    });
});

app.post('/login/auth', async (req, res) => {
    const {email, password} = req.body;

    try {
        const result = await pool.query(
            `SELECT * FROM public.user WHERE email = $1`,
            [email]
        );

        if (result.rows.length === 0) {
            req.flash('error', 'Email tidak ditemukan');
            return res.redirect('/login');
        }

        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            req.flash('error', 'password salah');
            return res.redirect("/login");
        }

        req.session.user = {
            name: user.name,
            email: user.email,
        };

        res.redirect("/");
    } catch (err) {
        console.error('Error saat login: ', err);
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/login');
    }
});

// Tombol Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session: ', err);
        }
        res.redirect('/login');
    });
});

// Halaman Register
app.get('/register', guest, (req, res) => {
    res.render('auth/register', {
        layout: "layouts/app",
        title: "Register",
        css: "../assets/css/auth.css",
        js: "",
        message: req.flash("error"),
    });
});

app.post('/register/store', async (req, res) => {
    try {
        let {email, password, name} = req.body;
        
        const duplicateEmail = await pool.query(
            `SELECT * FROM public.user WHERE email = $1`,
            [email]
        );

        if (duplicateEmail.rows.length > 0) {
            req.flash("error", "email sudah terdaftar");
            return res.redirect('/register');
        }

        const hashPassword = await bcrypt.hash(password, 10);

        await pool.query(
            `INSERT INTO public.user (email, password, name) VALUES ($1, $2, $3)`,
            [email, hashPassword, name]
        );

        req.flash('success', 'Registrasi berhasil, silahkan login');
        res.redirect('/login');
    } catch (error) {
        console.error('Error saat register: ', err);
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/register');
    }
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