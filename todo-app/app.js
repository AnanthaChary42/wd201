const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");

app.use(bodyParser.json());

// GET /todos - log a message
app.get("/todos", (request, response) => {
    console.log("Todo List");
    response.send("Todo List endpoint");
});

// POST /todos - create a new todo
app.post("/todos", async (request, response) => {
    console.log("Create a new todo", request.body);
    try {
        const todo = await Todo.addTodo({
            title: request.body.title,
            dueDate: request.body.dueDate,
            completed: false
        });
        return response.json(todo);
    } catch (error) {
        console.error(error);
        return response.status(422).json({ error: error });
    }
});

// PUT /todos/:id/markAsComplete - log update request
app.put("/todos/:id/markAsComplete", async (request, response) => {
    console.log("we have to update a todo with id:", request.params.id);
    try {
        const todo = await Todo.findByPk(request.params.id);

        const updatedTodo = await todo.markAsCompleted();
        return response.json(updatedTodo);
    } catch (error) {
        console.error(error);
        return response.status(422).json({ error: error.message });
    }
});

// DELETE /todos/:id - log delete request
app.delete("/todos/:id", (request, response) => {
    console.log("delete a todo with id :", request.params.id);
    response.send(`Deleting todo with id: ${request.params.id}`);
});

// Start server
module.exports = app;
