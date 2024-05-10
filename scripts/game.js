import MainScene from './scripts/scenes/mainScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: MainScene,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 200 }
      }
  }
};

const game = new Phaser.Game(config);