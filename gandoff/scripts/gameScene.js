import KeybindHandler from './input/keybindHandler.js';

export default class GameScene extends Phaser.Scene {
    constructor(game) {
        super(game);
    }

    create() {
        this.keybindHandler = new KeybindHandler(this);
    }
}