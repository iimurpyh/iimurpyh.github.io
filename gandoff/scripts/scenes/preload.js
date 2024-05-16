export default class PreloadScene extends Phaser.Scene {
    constructor() {
      super({ key: 'PreloadScene' });
    }
  
    preload() {
      this.load.aseprite('player', 'assets/img/player.png', 'assets/spritesheets/player.json');
      this.load.html('menu', 'assets/text/menu.html');
    }
  
    create() {
      this.anims.createFromAseprite('player');
      this.scene.start('MenuScene');
    }
  }