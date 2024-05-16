export default class MenuScene extends Phaser.Scene {
    static menuStates = ['menu-main', 'menu-host', 'menu-join']

    constructor() {
      super({ key: 'MenuScene' });
    }

    create() {
      this._menu = this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2).createFromCache('menu');
      this._menu.addListener('click');

      // Click callback is going to override 'this' so put it in a variable
      const this_scene = this;

      this._menu.on('click', function(event) {
        if (event.target.name == 'menu-switch') {
          let switchTo = event.target.dataset.switchTo;

          for (let state of MenuScene.menuStates) {
            this.getChildByID(state).style.display = 'none';
          }
          this.getChildByID(switchTo).style.display = 'flex';

          if (switchTo == 'menu-host') {
            // Generate a 5-digit hexidecimal string to make an alphanumeric code
            let num = (Math.random() * 0xFFFFF-1) + 1
            this_scene._roomCode = num.toString(16);
            this.getChildByID('room-code-highlight').innerHTML = this_scene._roomCode;
          }
        }
      })
    }
  }