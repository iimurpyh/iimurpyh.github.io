import CharacterState from '../characterState.js';

export default class Jump extends CharacterState {
    constructor() {
        super();
        this.animationName = 'jump_up';
        this.animationLoop = true;
    }

    enter(player) {
        super.enter(player);
        this.duration = player.jumpTime;
        player.grounded = false;
    }

    update(player, dt) {
        super.update(player, dt);
        player.sprite.body.setVelocityY(-player.jumpPower);

        if (this.elapsedTime >= player.jumpTime) {
            return 'fall';
        }
    }
}