import Direction from '../input/direction.js';
import Constants from '../constants.js';
import StateManager from '../playerStates/stateManager.js';
import PlayerStateMap from '../playerStates/stateMap.js';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.walkSpeed = Constants.Player.WALK_SPEED;
    this.jumpPower = Constants.Player.JUMP_POWER;
    this.jumpTime = Constants.Player.JUMP_TIME;

    this.setCollideWorldBounds(true)
    this.setInteractive();
    this.body.setDrag(Constants.Player.DRAG, 0);
    this.body.maxVelocity.set(Constants.Player.MAX_SPEED, Constants.Player.MAX_SPEED*10);


    let states = {}
    // Build player state map
    for (let stateName in PlayerStateMap) {
      states[stateName] = new PlayerStateMap[stateName]();
    }

    this._grounded = true;
    this._stateManager = new StateManager(states, 'idle', [this]);
  }

  setMoving(moveDirection, active) {
    if (active) {
      if (moveDirection == Direction.Right) {
        this.body.setAccelerationX(this.walkSpeed);
        this.setFlipX(false);
      } else {
        this.body.setAccelerationX(-this.walkSpeed);
        this.setFlipX(true);
      }

      if (this._grounded && this._stateManager.is('idle')) {
        this._stateManager.set('run');
      }
    } else {
      this.body.setAccelerationX(0);
      if (this._stateManager.is('run')) {
        this._stateManager.set('idle');
      }
    }
  }

  setJumping(active) {
    if (active) {
      this.body.setVelocityY(-this.jumpPower);
    } else {
      this.body.setAccelerationY(0);
    }
  }

  update() {

  }
}
