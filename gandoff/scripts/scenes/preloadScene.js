export default class PreloadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PreloadScene' });
    }
  
    preload() {
      this.load.aseprite('player', 'assets/img/player.png', 'assets/spritesheets/player.json');
    }
  
    create() {
      this.scene.start('MainScene');
    }
  }