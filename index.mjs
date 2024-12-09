import express from 'express'
import cors from 'cors'
const app = express();
const port = 5000;

app.use(cors());

app.use(express.json());

let tasks = [];
let counter = 1;

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

//добавление таска
app.post('/tasks', (req, res) => {
  const { text } = req.body;
  if (text) {
    const newTask = { id: counter++, text, isDone: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
  } else {
    res.status(400).json({ error: 'Поле пустое' });
  }
});

//выполнение таска
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { isDone } = req.body;
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    task.isDone = isDone;
    res.json(task);
  } else {
    res.status(404).json({ error: 'Задание не найдено' });
  }
});

//удаление таска
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === parseInt(id));
  if (index !== -1) {
    tasks.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ error: 'Задание не найдено' });
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});