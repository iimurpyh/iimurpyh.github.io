export default class MenuScene extends Phaser.Scene {
    constructor() {
      super({ key: 'MenuScene' });
    }

    create() {
      this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2).createFromCache('menu');
    }
  }