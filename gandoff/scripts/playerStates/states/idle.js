import CharacterState from '../characterState.js';

export default class Idle extends CharacterState {
    constructor() {
        super();
    }

    update(player, dt) {
        super.update(player, dt);
        
        if (!player.grounded) {
            return 'fall';
        } else if (player.moving) {
            return 'run';
        }
    }
}