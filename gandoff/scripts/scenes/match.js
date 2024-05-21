import GameScene from '../gameScene.js';
import Player from '../entities/player.js';
import Direction from '../input/direction.js';

export default class MatchScene extends GameScene {
  constructor() {
    super({ key: 'MatchScene' });
  }

  create(data) {
    super.create();
    this._localPlayer = new Player(this, this.cameras.main.width / 2, 0);
    this._otherPlayer = new Player(this, this.cameras.main.width / 2, 0);
    this._bindKeys();
    this._peer = data.peer;
    this._connection = data.connection;

    this._connection.on('data', (info) => {
      this._otherPlayer.setPacket(info);
    })
  }

  update(t, dt) {
    this._localPlayer.update(t, dt);
    this._otherPlayer.update(t, dt);

    let message = this._localPlayer.generatePacket();
    this._connection.send(message);
  }

  _bindKeys() {
    this.keybindHandler.connectToBind('move_left', this._onMoveLeft.bind(this));
    this.keybindHandler.connectToBind('move_right', this._onMoveRight.bind(this));
    this.keybindHandler.connectToBind('jump', this._onJump.bind(this));
  }

  _onMoveLeft(_event, pressed) {
    this._localPlayer.setMoving(Direction.Left, pressed);
  }

  _onMoveRight(_event, pressed) {
    this._localPlayer.setMoving(Direction.Right, pressed);
  }

  _onJump(_event, pressed) {
    this._localPlayer.setJumping(pressed);
  }
}