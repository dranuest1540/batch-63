import express from 'express';
import hbs from 'hbs';
import pool from '../src/config/database.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import moment from 'moment';
import flash from 'express-flash';
import session from 'express-session';
import {guest, auth} from "../src/middleware/auth.js";
import serverless from "serverless-http";
import { fileURLToPath } from 'url';
import pgConnect from 'connect-pg-simple';

const app = express()
const port = process.env.PORT || 3000

const storageExperience = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/assets/uploads/works");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const storageProject = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/assets/uploads/projects");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const uploadProject = multer({ storage: storageProject });
const uploadExperience = multer({ storage: storageExperience });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PgSession = pgSession(session);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../src/views')); // versi vercel

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, '../public'))); // versi vercel
app.use("/views", express.static("src/views"))
app.use(session({ // Menambahkan sesi middleware flash
    secret: 'secretSession',
    resave: false,
    saveUninitialized: true,
})); 
app.use(flash()); 
app.use((req, res, next) => { // Middleware session to auth navigation
    res.locals.user = req.session.user;
    next();
});
app.use(session({ // Sesi login di server
    store: new PgSession({
        pool: pool,             // koneksi PostgreSQL
        tableName: 'session',   // nama table session
        createTableIfMissing: true
    }),
    secret: 'secretSession',     // ganti dengan secret random kamu
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 24 * 60 * 60 * 1000 // 1 hari
    }
}));

hbs.registerPartials(path.join(__dirname, '../src/views/partials'));  // versi vercel

// ========== REGISTER HELPER ==========
hbs.registerHelper('formatDate', function (date) { // hbs format-date helper
    if (!date) return "";
    return moment(date).format("MMM YYYY")
});
hbs.registerHelper('formatDateReset', function (date) { // hbs format-date reset helper
    if (!date) return "";
    return moment(date).format("YYYY-MM-DD");
});
hbs.registerHelper('includes', function (array, value) { // hbs checbox condition project helper
    if (!Array.isArray(array)) return false;
    return array.includes(value);
});
hbs.registerHelper('splitTech', function (techString) { // hbs checkbox project helper
    if (Array.isArray(techString)) return techString; 
    if (typeof techString === 'string') return techString.split(',').map(t => t.trim());
    return [];
});
hbs.registerHelper('eq', (a, b) => a === b); // hbs selection edit project helper

// ========== HALAMAN INDEX ==========
app.get('/', async (req, res) => {
    try {
        const experienceResult = await pool.query("SELECT * FROM experience");
        const projectResult = await pool.query("SELECT * FROM project");

        res.render('index', {
        layout: "layouts/app",
        title: "Danu Prastyo",
        css: "/assets/css/style.css",
        js: "/assets/js/script.js",
        experience: experienceResult.rows,
        project: projectResult.rows,
    });
    } catch (error) {
        console.error(error);
        res.status(500).send("Failed read data");
    }
})

// ========== HALAMAN LOGIN ==========
app.get('/login', guest, (req, res) => {
    res.render('auth/login', {
        layout: "layouts/app",
        title: "Login",
        css: "../assets/css/style.css",
        js: "../assets/js/script.js",
        message: req.flash("error"),
    })
})

// Login Authentivication
app.post('/login/auth', guest, async (req, res) => {
    const { email, password } = req.body;

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

        // Ganti bcrypt.compare dengan perbandingan langsung
        if (password !== user.password) {
            req.flash('error', 'Password salah');
            return res.redirect('/login');
        }

        req.session.user = {
            name: user.name,
            email: user.email,
        };

        res.redirect('/');
    } catch (err) {
        console.error('Error saat login:', err);
        req.flash('error', 'Terjadi kesalahan pada server');
        res.redirect('/login');
    }
});

// Logout
app.get('/logout', auth, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session: ', err);
        }
        res.redirect('/login');
    });
});

// ========== HALAMAN WORK EXPERIENCE ==========
app.get('/formExperience', auth, async (req, res) => {
        res.render('formExperience', {
        layout: "layouts/app",
        title: "Add Experience",
        css: "../assets/css/style.css",
        js: "../assets/js/experience.js",
        experience: null,
    })    
})

// Store Data
app.post('/formExperience/store', auth, uploadExperience.single("company_logo"), async (req, res) => {
    try {
        const { position, company_name, start_date, end_date, responsibilities, tech_stack } = req.body;
        const image = req.file.filename;

        const listResponsibilities = Array.isArray(responsibilities) ? responsibilities : [responsibilities];
        const checkboxTech = Array.isArray(tech_stack) ? tech_stack : [tech_stack];

        await pool.query(
            "INSERT INTO experience (position, company_name, start_date, end_date, responsibilities, tech_stack, company_logo) VALUES ($1, $2, $3, $4, $5, $6, $7)",
            [position, company_name, start_date, end_date, listResponsibilities, checkboxTech, image]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error inserting data");
    }
});

// Destroy Data
app.get('/formExperience/destroy/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT company_logo FROM experience WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            console.log("Experience not found!");
            return res.status(404).send("Experience not found!");
        }

        const imageFileName = result.rows[0].company_logo;
        const imagePath = path.join("src", "assets", "uploads", "works", imageFileName);

        await pool.query("DELETE FROM experience WHERE id = $1", [id]);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image file: ${imageFileName}`);
        } else {
            console.log(`Image file not found: ${imageFileName}`);
        }
        res.redirect('/');
    } catch(err) {
        console.error("Failed destroy experience: ", err);
        res.status(500).send("Failed destroy experience");
    }
});

// Edit Data
app.get('/formExperience/edit/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT * FROM experience WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).send("Data not found");
        }

        const experience = result.rows[0];
        
        res.render('formExperience', {
            layout: "layouts/app",
            title: "Edit Experience",
            css: "../../assets/css/style.css",
            js: "../../assets/js/editExperience.js",
            experience,
        })    
    } catch (error) {
        console.error(error);
        res.status(500).send("Error load data");
    }
});

// Update Data
app.post('/formExperience/update/:id', auth, uploadExperience.single("company_logo"), async (req, res) => {
    try {
		const id = req.params.id;
		const { position, company_name, start_date, end_date, responsibilities, tech_stack } = req.body;
		const listResponsibilities = Array.isArray(responsibilities) ? responsibilities : [responsibilities];
		const checkboxTech = Array.isArray(tech_stack) ? tech_stack : [tech_stack];

		const oldImage = await pool.query("SELECT company_logo FROM experience WHERE id = $1", [id]);
		if (oldImage.rows.length === 0) {
			return res.status(404).send("Logo not found");
		}

        let imageFileName = oldImage.rows[0].company_logo;

        // 🔹 Jika upload logo baru
        if (req.file) {
            const newImage = req.file.filename;
            const oldImagePath = path.join("src", "assets", "uploads", "works", imageFileName);

            // 🔹 Hapus file lama (jika ada)
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            imageFileName = newImage; // simpan nama file baru
        }

		await pool.query(`UPDATE experience SET position = $1, company_name = $2, start_date = $3, end_date = $4, responsibilities = $5, tech_stack = $6, company_logo = $7 WHERE id = $8`, 
            [position, company_name, start_date, end_date, listResponsibilities, checkboxTech, imageFileName, id]);

		res.redirect('/');
	} catch (err) {
		console.error(err);
		res.status(500).send("Error updating data");
	}
});

// ========== HALAMAN PROJECT ==========
app.get('/formProject', auth, (req, res) => {
    res.render('formProject', {
        layout: "layouts/app",
        title: "Add Project",
        css: "../assets/css/style.css",
        js: "../assets/js/project.js",
        project: null,
    })
})

// Store Data
app.post('/formProject/store', auth, uploadProject.single("project_image"), async (req, res) => {
    try {
        const { title, description, tech_stack, repository_status, demo_status, link_repository, link_demo } = req.body;
        const image = req.file.filename;

        const checkboxTech = Array.isArray(tech_stack) ? tech_stack : [tech_stack];

        await pool.query(
            "INSERT INTO project (title, description, repository_status, demo_status, tech_stack, project_image, link_repository, link_demo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
            [title, description, repository_status, demo_status, checkboxTech, image, link_repository, link_demo]
        );
        res.redirect('/');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error inserting data");
    }
});

// Destroy Data
app.get('/formProject/destroy/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT project_image FROM project WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            console.log("Project not found!");
            return res.status(404).send("Project not found!");
        }

        const imageFileName = result.rows[0].project_image;
        const imagePath = path.join("src", "assets", "uploads", "projects", imageFileName);

        await pool.query("DELETE FROM project WHERE id = $1", [id]);

        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image file: ${imageFileName}`);
        } else {
            console.log(`Image file not found: ${imageFileName}`);
        }
        res.redirect('/');
    } catch(err) {
        console.error("Failed destroy project: ", err);
        res.status(500).send("Failed destroy project");
    }
});

// Edit Data
app.get('/formProject/edit/:id', auth, async (req, res) => {
    try {
        const id = req.params.id;
        const result = await pool.query("SELECT * FROM project WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).send("Data not found");
        }

        const project = result.rows[0];
        
        res.render('formProject', {
            layout: "layouts/app",
            title: "Edit Project",
            css: "../../assets/css/style.css",
            js: "../../assets/js/editProject.js",
            project,
        })    
    } catch (error) {
        console.error(error);
        res.status(500).send("Error load data");
    }
});

// Update Data
app.post('/formProject/update/:id', auth, uploadProject.single("project_image"), async (req, res) => {
    try {
		const id = req.params.id;
		const { title, description, tech_stack, repository_status, demo_status, link_repository, link_demo } = req.body;
		const checkboxTech = Array.isArray(tech_stack) ? tech_stack : [tech_stack];

		const oldImage = await pool.query("SELECT project_image FROM project WHERE id = $1", [id]);
		if (oldImage.rows.length === 0) {
			return res.status(404).send("image not found");
		}

        let imageFileName = oldImage.rows[0].project_image;

        // 🔹 Jika upload Image baru
        if (req.file) {
            const newImage = req.file.filename;
            const oldImagePath = path.join("src", "assets", "uploads", "projects", imageFileName);

            // 🔹 Hapus file lama (jika ada)
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            imageFileName = newImage; // simpan nama file baru
        }

		await pool.query(`UPDATE project SET title = $1, description = $2, tech_stack = $3, project_image = $4, repository_status = $5, demo_status = $6, link_repository = $7, link_demo = $8 WHERE id = $9`, 
            [title, description, checkboxTech, imageFileName, repository_status, demo_status, link_repository, link_demo, id]);

		res.redirect('/');
	} catch (err) {
		console.error(err);
		res.status(500).send("Error updating data");
	}
});

export default app;
export const handler = serverless(app);
