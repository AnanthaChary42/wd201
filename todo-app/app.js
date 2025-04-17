const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { title } = require("process");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (request, response) => {
  try {
    const allTodos = await Todo.findAll({ order: [["dueDate", "ASC"]] });
    const today = new Date().toISOString().split("T")[0];

    const overdue = allTodos.filter((t) => t.dueDate < today && !t.completed);
    const dueToday = allTodos.filter(
      (t) => t.dueDate === today && !t.completed,
    );
    const dueLater = allTodos.filter((t) => t.dueDate > today && !t.completed);
    const completed = allTodos.filter((t) => t.completed);

    if (request.accepts("html")) {
      response.render("index", {
        title: "Todo application",
        overdue,
        dueToday,
        dueLater,
        completed,
      });
    } else {
      response.json({
        overdue,
        dueToday,
        dueLater,
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

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

app.post("/add-task", async (req, res) => {
  try {
    const { task, dueDate } = req.body;
    await Todo.create({ title: task, dueDate, completed: false });
    res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    return res.json(todo);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});

app.delete("/todos/:id", async (request, response) => {
  console.log("Delete a todo by ID: ", request.params.id);
  try {
    await Todo.remove(request.params.id);
    return response.json({ success: true });
  } catch (error) {
    return response.status(422).json(error);
  }
});

module.exports = app;
