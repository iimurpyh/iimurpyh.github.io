export default class CharacterState {
    constructor() {
        this.animationName = 'idle';
        this.duration = -1;
    }

    update(_player, dt) {
        if (this.duration != -1) {
            this.duration -= dt*1000;
            if (this.duration <= 0) {
                return 'idle';
            }
        }
    }

    enter(_player, _dt) {
        _player.play(this.animationName);
    }
}