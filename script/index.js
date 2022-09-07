import {Game} from './game.js';
import {View} from './view.js';
import {Controller} from './controller.js';

export const SIZE_BLOCK = 30;
export const COLUMNS = 10;
export const ROWS = 20;

const game = new Game();
const view = new View(document.querySelector('.container'));
const controller = new Controller(game, view);

controller.init();

const audio = document.createElement('audio');
audio.src = '../music/Tetris.mp3';
audio.play();
audio.addEventListener('ended', () => {
  audio.play();
});
