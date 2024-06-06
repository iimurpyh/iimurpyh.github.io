import CharacterState from '../characterState.js';

export default class SwingAttack extends CharacterState {
    constructor(player) {
        super();
        this.animationName = 'run';
        this.duration = 1.2;
        this.locksMovement = true;

        player.makeHitbox('swingAttack1', 10, 0, 20, 0)
    }

    enter(player) {
        super.enter(player);
        player.setActualDirection(player.facingDirection);
        this.onDuration(1, () => {
            player.sprite.body.setVelocityX(1000);
        });
    }
}