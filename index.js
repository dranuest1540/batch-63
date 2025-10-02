import express from 'express'
const app = express()
const port = 3000

app.set('view engine', 'hbs');
app.set("views", "src/views");

app.use("/assets", express.static("src/assets"))
app.use("/views", express.static("src/views"))

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/project', (req, res) => {
    res.render('project')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/description', (req, res) => {
    res.render('description')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
