import CharacterState from '../characterState.js';

export default class Fall extends CharacterState {
    constructor() {
        super();
        this.animationName = 'jump_down';
        this.animationLoop = true;
    }

    update(player, dt) {
        super.update(player, dt);
        if (player.grounded) {
            return 'idle';
        }
    }
}