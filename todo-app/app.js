"use strict";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const csurf = require("tiny-csrf");
const path = require("path");

const { Todo } = require("./models");

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieparser("shh! some secret string"));

// Only enable CSRF protection outside of test environment
if (process.env.NODE_ENV !== "test") {
  app.use(csurf("This_should_be_32_character_long", ["POST", "PUT", "DELETE"]));
}

// Home route: renders HTML or JSON
app.get("/", async (req, res) => {
  try {
    const allTodos = await Todo.getTodos();
    const today = new Date().toISOString().split("T")[0];

    const overdue = allTodos.filter(t => t.dueDate < today && !t.completed);
    const dueToday = allTodos.filter(t => t.dueDate === today && !t.completed);
    const dueLater = allTodos.filter(t => t.dueDate > today && !t.completed);
    const completed = allTodos.filter(t => t.completed);

    if (req.accepts("html")) {
      return res.render("index", {
        title: "Todo Application",
        overdue,
        dueToday,
        dueLater,
        completed,
        csrfToken: req.csrfToken(),
      });
    }

    // JSON API response
    return res.json({ overdue, dueToday, dueLater });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});

// Create via HTML form
app.post("/add-task", async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    // Prevent adding a task with empty or whitespace-only title
    if (!title.trim()) {
      return res.status(422).send("Title cannot be empty or whitespace.");
    }
    await Todo.addTodo({ title, dueDate });
    return res.redirect("/");
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

// API: Create todo (for tests and AJAX)
app.post("/todos", async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    // Prevent adding a task with empty or whitespace-only title
    if (!title.trim()) {
      return res.status(422).send("Title cannot be empty or whitespace.");
    }
    const todo = await Todo.addTodo({ title, dueDate });
    return res.status(302).json(todo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

// API: Fetch a single todo by ID
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    return res.json(todo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

// API: Update completion status
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    await todo.setCompletionStatus(req.body.completed);
    return res.json(todo);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

// API: Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    await Todo.remove(req.params.id);
    return res.json(true);
  } catch (error) {
    console.error(error);
    return res.status(422).json(error);
  }
});

// Start server when run directly
if (require.main === module) {
  app.listen(4000, () => console.log("Server listening on http://localhost:4000"));
}

module.exports = app;
