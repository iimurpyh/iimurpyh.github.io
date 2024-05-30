import CharacterState from '../characterState.js';

export default class SwingAttack extends CharacterState {
    constructor() {
        super();
        this.animationName = 'run';
        this.duration = 1.2;
        this.locksMovement = true;
    }

    enter(player) {
        super.enter(player);
        this.onDuration(1, () => {
            player.setVelocityX(1000);
        });
    }
}