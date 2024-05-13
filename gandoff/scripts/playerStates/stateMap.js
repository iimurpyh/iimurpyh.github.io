import Idle from './states/idle.js';
import Run from './states/run.js';

// List of every character state

const PlayerStateMap = {
    idle: Idle,
    run: Run
}

export default PlayerStateMap;