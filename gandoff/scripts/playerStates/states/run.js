import CharacterState from '../characterState.js';

export default class Run extends CharacterState {
    constructor() {
        super();
        this.animationName = 'run';
        this.duration = -1;
    }
}