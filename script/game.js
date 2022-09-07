import {tetrominoes} from './tetrominoes.js';
import {ROWS, COLUMNS} from './index.js';

export class Game {
  score = 0;
  lines = 0;
  level = 1;
  record = localStorage.getItem('record') || 0;
  user = localStorage.getItem('user') || '';

  points = [0, 100, 300, 700, 1500];

  gameOver = false;
  showResults = false;

  area = [
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
    ['o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'],
  ];

  activeTetramino = this.createTetramino();

  nextTetramino = this.createTetramino();

  changeTetramino() {
    this.activeTetramino = this.nextTetramino;
    this.nextTetramino = this.createTetramino();
  }

  clearRow() {
    const rows = [];
    for (let i = ROWS - 1; i >= 0; i--) {
      const line = this.area[i];
      let count = 0;
      for (let j = 0; j < COLUMNS; j++) {
        const element = line[j];
        if (element !== 'o') {
          count += 1;
        }
      }
      if (!count) break;
      if (count === COLUMNS) {
        const audio = document.createElement('audio');
        audio.src = '../music/deleteRow.mp3';
        audio.play();
        rows.unshift(i);
      }
    }

    rows.forEach(item => {
      this.area.splice(item, 1);
      this.area.unshift(Array(COLUMNS).fill('o'));
    });

    return rows.length;
  }

  createTetramino() {
    const keys = Object.keys(tetrominoes);
    const key = keys[Math.floor(Math.random() * keys.length)];
    return {
      x: 3,
      y: 0,
      rotationIndex: 0,
      rotation: tetrominoes[key],
      block: tetrominoes[key][0],
    };
  }

  moveLeft() {
    if (this.checkPosition(this.activeTetramino.x - 1, this.activeTetramino.y)) {
      this.activeTetramino.x -= 1;
    }
  }

  moveRight() {
    if (this.checkPosition(this.activeTetramino.x + 1, this.activeTetramino.y)) {
      this.activeTetramino.x += 1;
    }
  }

  moveDown() {
    if (this.gameOver) return;
    if (this.checkPosition(this.activeTetramino.x, this.activeTetramino.y + 1)) {
      this.activeTetramino.y += 1;
    } else {
      this.stopMove();
    }
  }

  rotate() {
    this.activeTetramino.rotationIndex = this.activeTetramino.rotationIndex < 3 ?
      this.activeTetramino.rotationIndex + 1 : 0;
    this.activeTetramino.block = this.activeTetramino.rotation[this.activeTetramino.rotationIndex];

    if (!this.checkPosition(this.activeTetramino.x, this.activeTetramino.y)) {
      this.activeTetramino.rotationIndex = this.activeTetramino.rotationIndex > 0 ?
        this.activeTetramino.rotationIndex - 1 : 3;
      // eslint-disable-next-line max-len
      this.activeTetramino.block = this.activeTetramino.rotation[this.activeTetramino.rotationIndex];
    }
  }

  get viewArea() {
    const area = JSON.parse(JSON.stringify(this.area));
    const {x, y, block} = this.activeTetramino;
    if (this.checkPosition(x, y)) {
      for (let i = 0; i < block.length; i++) {
        const line = block[i];
        for (let j = 0; j < block.length; j++) {
          const element = line[j];
          if (element !== 'o') {
            area[y + i][x + j] = block[i][j];
          }
        }
      }
    }
    return area;
  }

  checkPosition(x, y) {
    const block = this.activeTetramino.block;
    for (let i = 0; i < block.length; i++) {
      const line = block[i];
      for (let j = 0; j < block.length; j++) {
        const element = line[j];
        if (element === 'o') continue;
        if (!this.area[y + i] || !this.area[y + i][x + j] || this.area[y + i][x + j] !== 'o') {
          return false;
        }
      }
    }
    return true;
  }

  stopMove() {
    const {x, y, block} = this.activeTetramino;
    for (let i = 0; i < block.length; i++) {
      const line = block[i];
      for (let j = 0; j < block.length; j++) {
        const element = line[j];
        if (element !== 'o') {
          this.area[y + i][x + j] = block[i][j];
        }
      }
    }
    this.changeTetramino();
    const lines = this.clearRow();
    this.calcScore(lines);
    this.updateData();
    this.gameOver = !this.checkPosition(this.activeTetramino.x, this.activeTetramino.y);
    this.showResults();
  }

  addRecords(record, player) {
    // eslint-disable-next-line max-len
    let recordTable = localStorage.getItem('records') ? JSON.parse(localStorage.getItem('records')) : [];
    if (recordTable.length > 8) {
      recordTable = recordTable.sort((a, b) => b.record - a.record).slice(0, 8);
    }
    recordTable.push({record, player});
    localStorage.setItem('records', JSON.stringify(recordTable));
  }

  calcScore(lines) {
    this.score += this.points[lines];
    this.lines += lines;
    this.level = Math.floor(this.lines / 10) + 1;

    if (this.score > this.record) {
      this.record = this.score;
      localStorage.setItem('record', this.record);
    }
  }

  updatePanel(showScore, showNextTetromino) {
    const {x, y} = this.activeTetramino;

    showScore(this.level, this.lines, this.score, this.record, this.user);
    showNextTetromino(this.nextTetramino.block);

    this.updateData = () => {
      if (this.checkPosition(x, y)) {
        showScore(this.level, this.lines, this.score, this.record, this.user);
        showNextTetromino(this.nextTetramino.block);
      }
    };

    this.showResults = () => {
      if (this.gameOver) {
        this.addRecords(this.score, this.user);
        this.showResults = true;
      }
    };
  }
}
