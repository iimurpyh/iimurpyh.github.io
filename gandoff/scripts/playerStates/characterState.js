export default class CharacterState {
    constructor() {
        this.animationName = 'idle';
        this.animationLoop = false;
        this.duration = -1;
        this.elapsedTime = 0;
    }

    update(_player, dt) {
        this.elapsedTime += dt/1000;
        if (this.elapsedTime >= this.duration) {
            return 'idle';
        }
    }

    enter(_player) {
        this.elapsedTime = 0;
        _player.play({
            key: this.animationName,
            repeat: this.animationLoop ? -1 : 0
        });
    }
}