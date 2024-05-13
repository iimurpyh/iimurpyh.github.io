export default class StateManager {
    constructor(stateMap = {}, initialStateName, args = []) {
        this._stateMap = stateMap;
        this._args = args;
        this.state = stateMap[initialStateName];
        this.stateName = initialStateName;
    }

    set(stateName) {
        if (this._stateMap[stateName]) {
            this.state = this._stateMap[stateName];
            this.state.enter(...this._args);
        } else {
            throw new Error(`No state with name ${stateName} exists`);
        }
    }

    is(stateName) {
        return this.stateName = stateName;
    }

    updateState(dt) {
        let newState = this.state.update(...this._args, dt);
        if (newState) {
            this.set(newState);
        }
    }
}