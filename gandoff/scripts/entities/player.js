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
    this.body.maxVelocity.set(Constants.Player.MAX_SPEED_X, Constants.Player.MAX_SPEED_Y);


    let states = {}
    // Build player state map
    for (let stateName in PlayerStateMap) {
      states[stateName] = new PlayerStateMap[stateName]();
    }

    this.grounded = false;
    this.moving = false;
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

      this.moving = true;
    } else {
      this.body.setAccelerationX(0);
      
      this.moving = false;
    }
  }

  setJumping(active) {
    if (active) {
      if (this.grounded) {
        this.grounded = false;
        this._stateManager.set('jump');
      }
    } else {
      this._stateManager.set('fall');
    }
  }

  update(_t, dt) {
    this.grounded = this.body.onFloor() || this.body.touching.down;
    this._stateManager.updateState(dt);
  }
}
