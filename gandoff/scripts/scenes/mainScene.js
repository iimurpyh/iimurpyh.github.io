import Player from '../objects/player.js';
export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    new Player(this, this.cameras.main.width / 2, 0)
  }

  update() {

  }
}