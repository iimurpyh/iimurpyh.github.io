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
    super(scene, x, y);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.body.setDrag(Constants.Player.DRAG, 0);
    this.body.maxVelocity.set(Constants.Player.MAX_SPEED_X, Constants.Player.MAX_SPEED_Y);
    this.body.setSize(50, 90);

    this.sprite = scene.add.sprite(26, 40, 'player');
    this.add(this.sprite);

    this.walkSpeed = Constants.Player.WALK_SPEED;
    this.jumpPower = Constants.Player.JUMP_POWER;
    this.jumpTime = Constants.Player.JUMP_TIME;

    this._hitboxes = {};
    this.hitboxGroup = scene.add.group();

    let states = {}
    // Build player state map
    for (let stateName in PlayerStateMap) {
      states[stateName] = new PlayerStateMap[stateName](this);
    }

    this.grounded = false;
    this.moving = false;
    this.jumping = false;
    this.movementLocked = false;
    this.facingDirection = Enum.Direction.LEFT;
    this.actualDirection = Enum.Direction.LEFT;
    this._stateManager = new StateManager(states, 'idle', [this]);

    this._moveChanged = false;
    this._jumpChanged = false;

    this._debugTag = scene.add.text(0, 0, 'text', {backgroundColor: 'black', fontFamily: 'sans-serif'});
  }

  makeHitbox(hitboxName, x, y, w, h) {
    let hitbox = new Hitbox(this.scene, this, x, y, w, h);
    this._hitboxes[hitboxName] = hitbox;
    //this.hitboxGroup.add(hitbox);
    this.add(hitbox);
  }

  enableHitbox(hitboxName, on) {
    this._hitboxes[hitboxName].setEnable(on);
  }

  setActualDirection(direction) {
    this.actualDirection = direction;
    this.sprite.setFlipX(direction == Enum.Direction.LEFT);
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

    this._debugTag.setPosition(this.body.position.x, this.body.position.y - 100);
    for (let hitboxName in this._hitboxes) {
      let hitbox = this._hitboxes[hitboxName];
      let offset = hitbox.offsetX;
      if (this.actualDirection == Enum.Direction.LEFT) {
        offset = -hitbox.offsetX;
      }
      hitbox.body.position.x = this.x + offset;
      hitbox.body.position.y = this.y + hitbox.offsetY;
    }
    this._debugTag.setText([this.getState(), this.movementLocked, this.actualDirection == Enum.Direction]);
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
      this.body.setVelocity(info.velocityX, info.velocityY);

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
