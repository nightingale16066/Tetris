import {
  SIZE_BLOCK,
  COLUMNS,
  ROWS,
} from '../script/index.js';

export class View {
  constructor(container) {
    this.container = container;
  }

  canvas = document.createElement('canvas');
  context = this.canvas.getContext('2d');

  colors = {
    J: 'FireBrick',
    I: 'Blue',
    O: 'Gold',
    L: 'LightBlue',
    2: 'Orange',
    T: 'Purple',
    S: 'Green',
  };

  init() {
    this.canvas.classList.add('game-area');
    this.container.append(this.canvas);
    this.canvas.width = SIZE_BLOCK * COLUMNS;
    this.canvas.height = SIZE_BLOCK * ROWS;
  }

  showArea(area) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < area.length; i++) {
      const line = area[i];
      for (let j = 0; j < line.length; j++) {
        const element = line[j];
        if (element !== 'o') {
          this.context.fillStyle = this.colors[element];
          this.context.strokeStyle = 'white';
          this.context.strokeRect(j * SIZE_BLOCK, i * SIZE_BLOCK, 30, 30);
          this.context.fillRect(j * SIZE_BLOCK, i * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
        }
      }
    }
  }

  createRow(playerName, playerScores) {
    const row = document.createElement('tr');
    const name = document.createElement('td');
    const scores = document.createElement('td');

    name.textContent = playerName;
    scores.textContent = playerScores;

    row.append(name, scores);

    return row;
  }

  sortRecord() {
    // eslint-disable-next-line max-len
    const recordTable = localStorage.getItem('records') ? JSON.parse(localStorage.getItem('records')) : [];
    recordTable.sort((a, b) => b.record - a.record);
    return recordTable;
  }

  createTable() {
    const table = document.querySelector('.record_table');
    const taleBody = document.querySelector('.table__body');
    const recordTable = this.sortRecord();
    table.classList.add('active');

    for (const {record, player} of recordTable) {
      taleBody.append(this.createRow(player, record));
    }

    table.addEventListener('click', ({target}) => {
      if (target.closest('.again')) {
        window.location = 'index.html';
      }
      if (target.closest('.end')) {
        table.innerHTML = ``;
        const img = document.createElement('img');
        const btn = document.createElement('button');
        btn.textContent = 'На главную';
        btn.style.margin = '10px 0';

        btn.addEventListener('click', () => {
          window.location = 'index.html';
        });

        img.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
        `;
        img.src = './img/pngwing.png';
        table.append(img, btn);
      }
    });
  }

  createUserInfo() {
    const container = document.createElement('div');
    const userElem = document.createElement('h2');
    const curLevelElem = document.createElement('p');
    const linesElem = document.createElement('p');
    const scoresElem = document.createElement('p');
    const recordElem = document.createElement('p');

    container.classList.add('userInfo');
    userElem.classList.add('userTitle');
    scoresElem.classList.add('userScores');

    container.append(userElem, curLevelElem, linesElem, scoresElem, recordElem);
    this.container.append(container);

    return (curLevel, lines, scores, record, user) => {
      curLevelElem.textContent = `Текущий уровень: ${curLevel}`;
      linesElem.textContent = `Число линий: ${+lines}`;
      scoresElem.textContent = `Очки: ${scores}`;
      recordElem.textContent = `Рекорд: ${record}`;
      userElem.textContent = `Игрок: ${user}`;
    };
  }

  createBlockNextTetro() {
    const container = document.createElement('div');
    const text = document.createElement('p');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.style.cssText = `
      width: ${SIZE_BLOCK * 4}px;
      height: ${SIZE_BLOCK * 4}px;
      border: #000 solid 2px;
      padding: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
    `;
    text.textContent = 'Следующая фигура';
    container.classList.add('next');
    container.append(text, canvas);

    this.container.append(container);

    return (nextTetro) => {
      context.clearRect(0, 0, nextTetro.width, nextTetro.height);
      canvas.width = SIZE_BLOCK * nextTetro.length;
      canvas.height = SIZE_BLOCK * nextTetro.length;


      for (let i = 0; i < nextTetro.length; i++) {
        const line = nextTetro[i];
        for (let j = 0; j < line.length; j++) {
          const element = line[j];
          if (element !== 'o') {
            context.fillStyle = this.colors[element];
            context.strokeStyle = 'white';
            context.strokeRect(j * SIZE_BLOCK, i * SIZE_BLOCK, 30, 30);
            context.fillRect(j * SIZE_BLOCK, i * SIZE_BLOCK, SIZE_BLOCK, SIZE_BLOCK);
          }
        }
      }
    };
  }

  createInfo() {
    const container = document.createElement('div');
    const info = document.createElement('p');
    const left = document.createElement('div');
    const right = document.createElement('div');
    const down = document.createElement('div');
    const bottom = document.createElement('div');
    const up = document.createElement('div');

    container.classList.add('info');
    info.textContent = 'Клавиши для управления:';
    left.textContent = 'Стрелка влево - перемещение фигуры влево';
    right.textContent = 'Стрелка вправо - перемещение фигуры вправо';
    down.textContent = 'Стрелка вниз - переместить фигуру вниз';
    bottom.textContent = 'Пробел - "уронить" фигуру';
    up.textContent = 'Стрелка вверх - повернуть фигуру';

    container.append(info, left, right, down, bottom, up);
    this.container.append(container);
  }
}
