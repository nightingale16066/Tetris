export class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
  }

  init() {
    this.view.init();
    this.start();
  }

  start() {
    this.view.showArea(this.game.viewArea);
    this.view.createInfo();

    this.game.updatePanel(this.view.createUserInfo(), this.view.createBlockNextTetro());

    const tick = () => {
      const time = 1100 - 100 * this.game.level;
      if (this.game.gameOver) {
        this.view.createTable();
        return;
      }
      setTimeout(() => {
        this.game.moveDown();
        this.view.showArea(this.game.viewArea);
        tick();
      }, time > 100 ? time : 100);
    };

    tick();

    window.addEventListener('keydown', (e) => {
      switch (e.code) {
        case 'ArrowLeft':
          this.game.moveLeft();
          this.view.showArea(this.game.viewArea);
          break;
        case 'ArrowRight':
          this.game.moveRight();
          this.view.showArea(this.game.viewArea);
          break;
        case 'ArrowUp':
          this.game.rotate();
          this.view.showArea(this.game.viewArea);
          break;
        case 'ArrowDown':
          this.game.moveDown();
          this.view.showArea(this.game.viewArea);
          break;
        case 'Space':
          // eslint-disable-next-line max-len
          while (this.game.checkPosition(this.game.activeTetramino.x, this.game.activeTetramino.y + 1)) {
            this.game.moveDown();
          }
          this.view.showArea(this.game.viewArea);
          break;
      }
    });
  }
}
