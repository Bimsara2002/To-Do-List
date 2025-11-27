const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const countEl = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const clearAllBtn = document.getElementById('clear-all');

let tasks = [];

// Save to localStorage
const save = () => {
  localStorage.setItem('todo_tasks_v1', JSON.stringify(tasks));
};

// Load from localStorage
const load = () => {
  const raw = localStorage.getItem('todo_tasks_v1');
  tasks = raw ? JSON.parse(raw) : [];
};

// Count tasks
const updateCount = () => {
  const total = tasks.length;
  const remaining = tasks.filter(t => !t.completed).length;
  countEl.textContent = `${remaining} remaining • ${total} total`;
};

// Build task node
const createTaskNode = (task) => {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');
  li.dataset.id = task.id;

  const chk = document.createElement('input');
  chk.type = 'checkbox';
  chk.checked = task.completed;
  chk.addEventListener('change', () => toggleComplete(task.id));

  const label = document.createElement('div');
  label.className = 'label';
  label.textContent = task.text;

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'icon-btn';
  editBtn.textContent = '✏️';
  editBtn.addEventListener('click', () => startEdit(task.id));

  const delBtn = document.createElement('button');
  delBtn.className = 'icon-btn';
  delBtn.textContent = '🗑️';
  delBtn.addEventListener('click', () => deleteTask(task.id));

  actions.append(editBtn, delBtn);
  li.append(chk, label, actions);

  return li;
};

// Render tasks
const render = () => {
  list.innerHTML = '';
  tasks.slice().reverse().forEach(task => {
    list.appendChild(createTaskNode(task));
  });
  updateCount();
};

// Add Task
const addTask = (text) => {
  const trimmed = text.trim();
  if (!trimmed) return;

  tasks.push({ 
    id: Date.now().toString(), 
    text: trimmed, 
    completed: false 
  });

  save();
  render();
};

// Delete task
const deleteTask = (id) => {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
};

// Toggle complete
const toggleComplete = (id) => {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  t.completed = !t.completed;
  save();
  render();
};

// Clear completed
const clearCompleted = () => {
  tasks = tasks.filter(t => !t.completed);
  save();
  render();
};

// Clear all
const clearAll = () => {
  if (!confirm('Delete all tasks?')) return;
  tasks = [];
  save();
  render();
};

// Edit task
const startEdit = (id) => {
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return;

  const li = list.querySelector(`li[data-id="${id}"]`);
  const label = li.querySelector('.label');

  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.value = tasks[idx].text;
  editInput.style.flex = '1';

  label.replaceWith(editInput);
  editInput.focus();
  editInput.select();

  const commit = () => {
    const newText = editInput.value.trim();
    if (newText) {
      tasks[idx].text = newText;
      save();
    }
    render();
  };

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') render();
  });

  editInput.addEventListener('blur', commit);
};

// FORM submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(input.value);
  input.value = '';
});

// Buttons
clearCompletedBtn.addEventListener('click', clearCompleted);
clearAllBtn.addEventListener('click', clearAll);

// Keyboard: "/" = focus input
window.addEventListener('keydown', (e) => {
  if (e.key === '/' && document.activeElement !== input) {
    e.preventDefault();
    input.focus();
  }
});

// Initialize
load();
render();
