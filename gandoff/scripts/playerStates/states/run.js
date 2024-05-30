import CharacterState from '../characterState.js';

export default class Run extends CharacterState {
    constructor() {
        super();
        this.animationName = 'run';
        this.animationLoop = true;
        console.log(this.started);
    }

    update(player, dt) {
        super.update(player, dt);
        if (!player.grounded) {
            return 'fall';
        } else if (!player.moving) {
            return 'idle';
        }
    }
}