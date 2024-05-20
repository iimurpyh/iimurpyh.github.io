import Direction from '../input/direction.js';
import Constants from '../constants.js';
import StateManager from '../playerStates/stateManager.js';
import PlayerStateMap from '../playerStates/stateMap.js';

let PlayerInfo;

protobuf.load('assets/text/playerInfo.proto', function(error, root) {
  if (error) {
      throw error;
  }

  PlayerInfo = root;
});


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
    this.jumping = false;
    this._stateManager = new StateManager(states, 'idle', [this]);

    this._moveChanged = false;
    this._jumpChanged = false;
  }

  setMoving(moveDirection, active) {
    this._moveChanged = true;
    this._moveDirection = moveDirection;
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
    this._jumpChanged = true;
    this.jumping = active;
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

  generatePacket() {
    if (PlayerInfo) {
      const PlayerStatePacket = PlayerInfo.lookupType('playerinfo.PlayerStatePacket');
      let packet = {
        positionX: this.x,
        positionY: this.y,
        velocityX: this.body.velocity.x,
        velocityY: this.body.velocity.y,
  
        state: this._stateManager.stateName,
        stateDuration: this._stateManager.state.duration
      };

      if (this._moveChanged) {
        packet.moveChange = this.moving;
        packet.moveChangeDirection = this._moveDirection;
      }

      if (this._jumpChanged) {
        packet.jumpChange = this.jumping;
      }

      let message = PlayerStatePacket.create(packet);

      return PlayerStatePacket.encode(message).finish();
    } else {
      return null;
    } 
  }

  setPacket(message) {
    let array = new Uint8Array(message);
    if (PlayerInfo) {
      const PlayerStatePacket = PlayerInfo.lookupType('playerinfo.PlayerStatePacket');
      let info = PlayerStatePacket.decode(array);
      this.setPosition(info.positionX, info.positionY);
      this.body.setVelocity(info.velocityX, info.velocityY);
      if (info.state) {
        this._stateManager.set(info.state);
        this._stateManager.state.duration = info.duration;
      }

      if (info.moveChange) {
        this.setMoving(info.moveChange, info.moveChangeDirection);
      }

      if (info.jumpChange) {
        this.setJumping(info.jumpChange);
      }
    }
  }
}
