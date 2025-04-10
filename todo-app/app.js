const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.static(path.join(__dirname, "public")));

// Home route - render todos grouped into categories
app.get("/", async (request, response) => {
  try {
    const allTodos = await Todo.findAll({ order: [["dueDate", "ASC"]] });
    const today = new Date().toISOString().split("T")[0];

    const overdue = allTodos.filter(todo => todo.dueDate < today && !todo.completed);
    const dueToday = allTodos.filter(todo => todo.dueDate === today);
    const dueLater = allTodos.filter(todo => todo.dueDate > today);

    if (request.accepts("html")) {
      response.render("index", { overdue, dueToday, dueLater });
    } else {
      response.json({ allTodos });
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

// RESTful APIs
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    return res.json(todos);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.addTodo(req.body);
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

// Handle form POST (from index.ejs)
app.post("/add-task", async (req, res) => {
  try {
    const { task, dueDate } = req.body;
    await Todo.create({
      title: task,
      dueDate: dueDate,
      completed: false
    });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const deleted = await Todo.destroy({ where: { id: req.params.id } });
    return res.send(deleted === 1);
  } catch (error) {
    console.log(error);
    return res.status(422).send(false);
  }
});

module.exports = app;
