const express = require("express");
const ehb = require("express-handlebars");
const pool = require("./db/conn");

const app = express();
const port = process.env.PORT || 3000;

const ehbPartials = ehb.create({
  partialsDir: ["views/partials"],
});

app.engine("handlebars", ehbPartials.engine);
app.set("view engine", "handlebars");

app.use(express.static("public"));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/book-register", (req, res) => {
  res.render("book-register");
});

app.post("/book-register/insert", (req, res) => {
  const { id, title, pages, year } = req.body;

  const data = ["title", "pages", "year", title, pages, year];

  const sqlQuery = `INSERT INTO books (??, ??, ??)
        VALUES(?, ?, ?)
    `;

  pool.query(sqlQuery, data, (err) => {
    if (err) return console.log("Error ao selecionar o livro " + err);
    res.redirect("/");
  });
});

app.get("/book/edit/:id", (req, res) => {
  const id = req.params.id;

  const data = ['id', id];

  const sqlQuery = `SELECT * FROM books WHERE ?? = ?`;

  pool.query(sqlQuery, data, (err, data) => {
    if (err) return console.log("Error ao selecionar o livro " + err);

    const book = data[0];

    res.render("book-edit", { book });
  });
});

app.post("/book/update-book", (req, res) => {
  const { id, title, pages, year } = req.body;

  const data = ["title", title, "pages", pages, "year", year, "id", id];

  const sqlQuery = `UPDATE books SET ?? = ?, ?? = ?, ?? = ? WHERE ?? = ? ;
    `;
  pool.query(sqlQuery, data, (err, data) => {
    if (err) return console.log("Error ao atualizar o livro " + err);
    res.redirect("/");
  });
});

app.get("/book-detail/:id", (req, res) => {
  const id = req.params.id;

  const data = ["id", id];

  const sqlQuery = `SELECT * FROM books WHERE ?? = ?`;

  pool.query(sqlQuery, data, (err, data) => {
    if (err) return console.log("Error ao ao selecionar o livro " + err);
    const book = data[0];

    res.render("book-detail", { book });
  });
});

app.post("/book/delete/:id", (req, res) => {
  const id = req.params.id;

  const data = ['id', id]

  const sqlQuery = `DELETE FROM books WHERE ?? = ?`;

  pool.query(sqlQuery, data, (err) => {
    if (err) return console.log("Error ao ao selecionar o livro " + err);
    res.redirect("/");
  });
});

app.get("/", (req, res) => {
  const sqlQuery = `SELECT * FROM books`;

  pool.query(sqlQuery, (err, data) => {
    if (err) return console.log("error na requisição do banco " + err);

    const books = data;

    res.render("home", { books: books });
  });
});

app.listen(port, console.log(`Escutando na porta ${port}`));
