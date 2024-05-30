import Enum from './enum.js';

const Constants = {
    Player: {
        DRAG: 1200,
        WALK_SPEED: 1700,
        JUMP_POWER: 700,
        JUMP_TIME: 0.3,
        MAX_SPEED_X: 700,
        MAX_SPEED_Y: 10000
    },
    ConnectionErrorMessages: {
        [Enum.ConnectionStatus.SUCCESS]: 'Success',
        [Enum.ConnectionStatus.NOT_HOSTING]: 'Error: Peer is not hosting.'
    }
}

export default Constants;