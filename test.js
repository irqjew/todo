const inputEl = document.getElementsByClassName('app__controls-input')[0];
const btnEl = document.getElementsByClassName('app__controls-button')[0];
const listEl = document.getElementsByClassName('app__list')[0];

let data = [];

function createTask(objectData) {
  const root = document.createElement('div');
  root.classList.add('app__list-item');

  if (objectData.isDone) {
    root.classList.add('app__list-item_done');
  }

  const input = document.createElement('input');
  input.classList.add('app__list-checkbox');
  input.type = 'checkbox';

  if (objectData.isDone) {
    input.checked = true;
  }

  input.addEventListener('click', () => {
    fetch(`http://localhost:5000/tasks/${objectData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isDone: input.checked }),
    }).then(() => {
      objectData.isDone = input.checked;
      if (objectData.isDone) {
        root.classList.add('app__list-item_done');
      } else {
        root.classList.remove('app__list-item_done');
      }
    });
  });

  const txt = document.createElement('p');
  txt.classList.add('app__list-item-text');
  txt.innerText = objectData.text;

  const btn = document.createElement('button');
  btn.classList.add('app__list-btn');

  const img = document.createElement('img');
  img.src = './vector.svg';
  img.alt = 'trash';

  btn.appendChild(img);

  btn.addEventListener('click', () => {
    fetch(`http://localhost:5000/tasks/${objectData.id}`, {
      method: 'DELETE',
    }).then(() => {
      const index = data.findIndex(item => item.id === objectData.id);
      if (index !== -1) {
        data.splice(index, 1);
        render();
      }
    });
  });

  root.appendChild(input);
  root.appendChild(txt);
  root.appendChild(btn);
  return root;
}

btnEl.addEventListener('click', () => {
  const textValue = inputEl.value.trim();
  if (textValue !== '') {
    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: textValue }),
    }).then(response => response.json())
      .then(newTask => {
        data.push(newTask);
        render();
        inputEl.value = '';
      });
  }
});

function render() {
  listEl.innerHTML = '';
  for (let item of data) {
    const tmpElement = createTask(item);
    listEl.appendChild(tmpElement);
  }
}

fetch('http://localhost:5000/tasks')
  .then(response => response.json())
  .then(tasks => {
    data = tasks;
    render();
  });