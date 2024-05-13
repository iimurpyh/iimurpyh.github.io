import PreloadScene from './scenes/preload.js';
import MatchScene from './scenes/match.js';

const DEFAULT_WIDTH = 1280
const DEFAULT_HEIGHT = 720

const config = {
  type: Phaser.AUTO,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MatchScene],
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 1000 }
      }
  }
};

const game = new Phaser.Game(config);