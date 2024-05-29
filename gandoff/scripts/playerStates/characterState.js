export default class CharacterState {
    constructor() {
        this.animationName = 'idle';
        this.animationLoop = false;
        this.duration = -1;
        this.elapsedTime = 0;
        this.locksMovement = false;
        this.started = false;
        this._durationCallbacks = [];
    }

    update(player, dt) {
        this.elapsedTime += dt/1000;
        if (this.elapsedTime >= this.duration) {
            return 'idle';
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
        console.log('setting time to 0');
        this.elapsedTime = 0;
        player.movementLocked = this.locksMovement;
        if (this.locksMovement) {
            player.setMoving(player.facingDirection, false);
            player.setJumping(false);
        }
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