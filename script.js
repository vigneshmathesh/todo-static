const form = document.getElementById('todoForm');
const input = document.getElementById('todoInput');
const list = document.getElementById('todoList');

const STORAGE_KEY = 'my-simple-todos';

function loadTodos(){
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveTodos(todos){ localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)); }

function render(){
  list.innerHTML = '';
  const todos = loadTodos();
  todos.forEach((t,i) => {
    const li = document.createElement('li');
    const text = document.createElement('span');
    text.textContent = t.text;
    if(t.done) text.classList.add('done');

    const actions = document.createElement('span');
    actions.className = 'actions';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = t.done ? 'Undo' : 'Done';
    toggleBtn.onclick = () => {
      todos[i].done = !todos[i].done;
      saveTodos(todos); render();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => {
      todos.splice(i,1); saveTodos(todos); render();
    };

    actions.appendChild(toggleBtn);
    actions.appendChild(delBtn);
    li.appendChild(text);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const value = input.value.trim();
  if(!value) return;
  const todos = loadTodos();
  todos.push({ text: value, done: false });
  saveTodos(todos);
  input.value = '';
  render();
});

render();
