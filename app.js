const express = require("express");
const app = express();
const { Todo } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const { response } = require("express");
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));



app.get("/", async (req, res) => {
    const allTodos = await Todo.getTodos();
    if (req.accepts("html")) {
    res.render("index", {
      allTodos,
    });
  } else {
    res.json(allTodos);
  }
});

app.get("/todos", async (req, res) => {
  console.log("Processing list of all Todos ...");
  try {
    const todos = await Todo.findAll({ order: [["id", "ASC"]] });
    return res.json(todos);
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});
app.post("/todos", async (req, res) => {
  try {
    const todo = await Todo.addTodo({
    title: req.body.title,
    dueDate: req.body.dueDate,
    completed: false,
    });
    return res.json(todo);
  }
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async (req, res) => {
console.log("Todo marks completed : ", req.params.id);
  const todo = await Todo.findByPk(req.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
    return res.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async (req, res) => {
  console.log("delete a todo with ID:", request.params.id);
  const affectedRow = await Todo.destroy({ where: { id: req.params.id } });
  res.send(affectedRow ? true : false);
});

module.exports = app;
