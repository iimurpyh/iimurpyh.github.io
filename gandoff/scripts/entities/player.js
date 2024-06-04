import Enum from '../enum.js';
import Constants from '../constants.js';
import StateManager from '../playerStates/stateManager.js';
import PlayerStateMap from '../playerStates/stateMap.js';
import Hitbox from './hitbox.js';

let PlayerInfo;

protobuf.load('assets/text/playerInfo.proto', function(error, root) {
  if (error) {
      throw error;
  }

  PlayerInfo = root;
});


export default class Player extends Phaser.GameObjects.Container {
  constructor(scene, x, y) {
    super(scene, 'player');

    this.sprite = scene.physics.add.sprite(x, y)
    scene.physics.add.existing(this.sprite);
    scene.add.existing(this);
    

    this.walkSpeed = Constants.Player.WALK_SPEED;
    this.jumpPower = Constants.Player.JUMP_POWER;
    this.jumpTime = Constants.Player.JUMP_TIME;

    this.sprite.setCollideWorldBounds(true)
    this.sprite.setInteractive();
    this.sprite.body.setDrag(Constants.Player.DRAG, 0);
    this.sprite.body.maxVelocity.set(Constants.Player.MAX_SPEED_X, Constants.Player.MAX_SPEED_Y);


    let states = {}
    // Build player state map
    for (let stateName in PlayerStateMap) {
      states[stateName] = new PlayerStateMap[stateName](this);
    }

    this.grounded = false;
    this.moving = false;
    this.jumping = false;
    this.facingDirection = Enum.Direction.LEFT;
    this.actualDirection = Enum.Direction.LEFT;
    this._stateManager = new StateManager(states, 'idle', [this]);

    this._moveChanged = false;
    this._jumpChanged = false;

    this._hitboxes = {};
    this.hitboxGroup = scene.add.group();
    this._debugTag = scene.add.text(0, 0, 'text', {backgroundColor: 'black', fontFamily: 'sans-serif'});
  }

  makeHitbox(hitboxName, x, y, w, h) {
    let hitbox = new Hitbox(this.scene, this, x, y, w, h);
    this._hitboxes[hitboxName] = hitbox;
    this.hitboxGroup.add(hitbox);
    this.add(hitbox);
  }

  setActualDirection(direction) {
    this.actualDirection = direction;
    this.sprite.setFlipX(this.actualDirection == Enum.Direction.LEFT);
  }

  setFacingDirection(direction) {
    this.facingDirection = direction;
  }

  setMoving(moveDirection, active) {
    this.setFacingDirection(moveDirection);

    this.moving = active;
  }

  setJumping(active) {
    if (this.movementLocked) {return;}
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

  getState() {
    return this._stateManager.stateName;
  }

  update(_t, dt) {
    this.grounded = this.body.onFloor() || this.body.touching.down;
    this._stateManager.updateState(dt);

    this._debugTag.setPosition(this.x, this.y - 100);
    this._debugTag.setText([this.getState(), this.facingDirection, this.actualDirection]);
  }

  generatePacket() {
    if (PlayerInfo) {
      const PlayerStatePacket = PlayerInfo.lookupType('playerinfo.PlayerStatePacket');
      let packet = {
        positionX: this.x,
        positionY: this.y,
        velocityX: this.body.velocity.x,
        velocityY: this.body.velocity.y,

        moving: this.moving,
        facingDirection: this.facingDirection,
        actualDirection: this.actualDirection,
        jumping: this.jumping,
  
        state: this._stateManager.stateName,
        stateDuration: this._stateManager.state.duration
      };

      let message = PlayerStatePacket.create(packet);
      return PlayerStatePacket.encode(message).finish();
    } else {
      return null;
    } 
  }

  setPacket(message) {
    // simulated packet loss:
    // if (Math.random() < 0.9) { return; }
    
    let array = new Uint8Array(message);
    if (PlayerInfo) {
      const PlayerStatePacket = PlayerInfo.lookupType('playerinfo.PlayerStatePacket');
      let info = PlayerStatePacket.decode(array);
      this.setPosition(info.positionX, info.positionY);
      this.sprite.body.setVelocity(info.velocityX, info.velocityY);

      if (info.moving != this.moving) {
        this.setMoving(info.facingDirection, info.moving);
      }
      if (info.actualDirection != this.actualDirection) {
        this.setActualDirection(info.actualDirection);
      }
      if (info.jumping != this.jumping) {
        this.setJumping(info.jumping);
      }

      this._stateManager.set(info.state);
      this._stateManager.state.duration = info.duration;
    }
  }
}
