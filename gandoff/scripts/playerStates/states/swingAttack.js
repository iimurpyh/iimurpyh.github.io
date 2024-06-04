import CharacterState from '../characterState.js';

export default class SwingAttack extends CharacterState {
    constructor(player) {
        super();
        this.animationName = 'run';
        this.duration = 1.2;
        this.locksMovement = true;

        player.makeHitbox('swingAttack1', {
            x: 10, y: 0, w: 20, y: 40
        })
    }

    enter(player) {
        super.enter(player);
        player.setActualDirection(player.facingDirection);
        this.onDuration(1, () => {
            player.setVelocityX(1000);
        });
    }
}