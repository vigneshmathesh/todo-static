const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const FILE = './todos.json';

// Load todos from file
function loadTodos() {
  if (!fs.existsSync(FILE)) return [];
  return JSON.parse(fs.readFileSync(FILE));
}

// Save todos to file
function saveTodos(todos) {
  fs.writeFileSync(FILE, JSON.stringify(todos, null, 2));
}

// Get all todos
app.get('/todos', (req, res) => {
  res.json(loadTodos());
});

// Add new todo
app.post('/todos', (req, res) => {
  const todos = loadTodos();
  const todo = { id: Date.now(), text: req.body.text, done: false };
  todos.push(todo);
  saveTodos(todos);
  res.json(todo);
});

// Toggle done
app.put('/todos/:id', (req, res) => {
  const todos = loadTodos();
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).send("Not found");
  todo.done = !todo.done;
  saveTodos(todos);
  res.json(todo);
});

// Delete todo
app.delete('/todos/:id', (req, res) => {
  let todos = loadTodos();
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  res.json({ message: "Deleted" });
});

const PORT = 80;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
