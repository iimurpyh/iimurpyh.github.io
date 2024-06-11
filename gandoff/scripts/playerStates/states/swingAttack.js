import CharacterState from '../characterState.js';
import Enum from '../../enum.js';

export default class SwingAttack extends CharacterState {
    constructor(player) {
        super();
        this.animationName = 'swing';
        this.frameRate = 5;
        this.duration = 1.2;
        this.locksMovement = true;

        player.makeHitbox('swingAttack1', 50, 20, 50, 90)
    }

    enter(player) {
        super.enter(player);
        player.setActualDirection(player.facingDirection);
        this.onDuration(0.6, () => {
            player.body.setVelocityX(player.facingDirection == Enum.Direction.LEFT ? -1000 : 1000);
            player.enableHitbox('swingAttack1', true);
            setTimeout(100, () => {
                player.enableHitbox('swingAttack1', false);
            })
        });
    }
}