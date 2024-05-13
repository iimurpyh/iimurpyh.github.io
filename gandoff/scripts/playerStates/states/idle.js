import CharacterState from '../characterState.js';

export default class Idle extends CharacterState {
    constructor() {
        super();
    }

    update(player, dt) {
        super.update(player, dt);
        console.log(player.moving);
        if (!player.grounded) {
            return 'fall';
        } else if (player.moving) {
            return 'run';
        }
    }
}