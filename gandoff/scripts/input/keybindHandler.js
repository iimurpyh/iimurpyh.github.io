let BindMap = {
    'move_left': {
        inputs: [
            Phaser.Input.Keyboard.KeyCodes.A
        ],
        conflicts: 'move_right'
    },
    'move_right': {
        inputs: [
            Phaser.Input.Keyboard.KeyCodes.D
        ],
        conflicts: 'move_left'
    },
    'jump': {
        inputs: [
            Phaser.Input.Keyboard.KeyCodes.W
        ]
    },
    'aim_left': {
        inputs: [
            Phaser.Input.Keyboard.KeyCodes.LEFT
        ],
        conflicts: 'aim_right'
    },
    'aim_right': {
        inputs: [
            Phaser.Input.Keyboard.KeyCodes.RIGHT
        ],
        conflicts: 'aim_left'
    }
};

// Turn arrays into Sets so we can index them faster
for (let [_, bindInfo] of Object.entries(BindMap)) {
    bindInfo.inputs = new Set(bindInfo.inputs);
}

export default class KeybindHandler {
    constructor(scene) {
        scene.input.keyboard.on('keyup', this._keyUp.bind(this));
        scene.input.keyboard.on('keydown', this._keyDown.bind(this));
        this._eventMap = {};
        this._activatedConflicts = new Set();
    }

    _fireBind(event, name, pressed, ignoreConflicts) {
        let bindInfo = BindMap[name];
        if (pressed) {
            this._activatedConflicts.add(name);
        } else {
            this._activatedConflicts.delete(name);
        }

        if (this._activatedConflicts.has(bindInfo.conflicts) && !ignoreConflicts) {
            if (pressed) {
                this._fireBind(event, bindInfo.conflicts, false, true);
                this._activatedConflicts.add(bindInfo.conflicts);
                return
            } else {
                this._fireBind(event, bindInfo.conflicts, true, true);
                return
            }
        }

        
        
        let callbacks = this._eventMap[name];
        if (callbacks) {
            for (let callback of callbacks) {
                callback(event, pressed);
            }
        }
    }

    _handleKeyPressed(event, pressed) {
        if (event.repeat) { return; }
        for (let [name, bindInfo] of Object.entries(BindMap)) {
            if (bindInfo.inputs.has(event.which)) {
                this._fireBind(event, name, pressed);
            }
        }
    }

    _keyUp(event) {
        this._handleKeyPressed(event, false);
    }

    _keyDown(event) {
        this._handleKeyPressed(event, true);
    }

    connectToBind(bindName, callback) {
        if (!BindMap[bindName]) {
            throw new Error(`No keybind named ${bindName} exists.`);
        }

        if (!this._eventMap[bindName]) {
            this._eventMap[bindName] = [];
        }

        this._eventMap[bindName].push(callback);
    }
}
  