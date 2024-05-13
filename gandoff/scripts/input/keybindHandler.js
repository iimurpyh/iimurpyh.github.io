let BindMap = {
    'move_left': [
        Phaser.Input.Keyboard.KeyCodes.LEFT,
        Phaser.Input.Keyboard.KeyCodes.A
    ],
    'move_right': [
        Phaser.Input.Keyboard.KeyCodes.RIGHT,
        Phaser.Input.Keyboard.KeyCodes.D
    ],
    'jump': [
        Phaser.Input.Keyboard.KeyCodes.UP,
        Phaser.Input.Keyboard.KeyCodes.W
    ],
};

// Turn arrays into Sets so we can index them faster
for (let [name, keys] of Object.entries(BindMap)) {
    BindMap[name] = new Set(keys);
}

export default class KeybindHandler {
    constructor(scene) {
        scene.input.keyboard.on('keyup', this._keyUp.bind(this));
        scene.input.keyboard.on('keydown', this._keyDown.bind(this));
        this._eventMap = {};
    }

    _handleKeyPressed(event, pressed) {
        if (event.repeat) { return; }
        for (let [name, keys] of Object.entries(BindMap)) {
            if (keys.has(event.which)) {
                let callbacks = this._eventMap[name];
                if (callbacks) {
                    for (let callback of callbacks) {
                        callback(event, pressed);
                    }
                }
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

        console.log(bindName);

        if (!this._eventMap[bindName]) {
            this._eventMap[bindName] = [];
        }

        this._eventMap[bindName].push(callback);
    }
}
  