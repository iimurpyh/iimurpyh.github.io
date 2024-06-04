import Enum from '../enum.js';
import Hitbox from '../entities/hitbox.js';

export default class CharacterState {
    constructor(_player) {
        this.animationName = 'idle';
        this.animationLoop = false;
        this.duration = -1;
        this.elapsedTime = 0;
        this.locksMovement = false;
        this.started = false;
        this._durationCallbacks = [];
        this._hitboxes = {};
    }

    update(player, dt) {
        if (this.duration != -1) {
            this.elapsedTime += dt/1000;
            if (this.elapsedTime >= this.duration) {
                return 'idle';
            }
        }

        if (!this.locksMovement) {
            player.setActualDirection(player.facingDirection);
            if (player.moving) {
                if (player.facingDirection == Enum.Direction.RIGHT) {
                    player.sprite.body.setAccelerationX(player.walkSpeed);
                } else {
                    player.sprite.body.setAccelerationX(-player.walkSpeed);
                }
            } else {
                player.sprite.body.setAccelerationX(0);
            }
        } else {
            player.sprite.body.setAccelerationX(0);
        }
        

        for (let i = this._durationCallbacks.length-1; i >= 0; i--) {
            let info = this._durationCallbacks[i];
            if (info.time >= this.elapsedTime) {
                info.callback();
                this._durationCallbacks.pop(i);
            }
        }
    }

    enter(player) {
        this.elapsedTime = 0;
        player.movementLocked = this.locksMovement;
        player.play({
            key: this.animationName,
            repeat: this.animationLoop ? -1 : 0
        });

        this.started = true;
    }

    onDuration(time, callback) {
        this._durationCallbacks.push({time: time, callback: callback})
    }
}