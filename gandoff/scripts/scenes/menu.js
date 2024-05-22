export default class MenuScene extends Phaser.Scene {
  static menuStates = ['menu-main', 'menu-host', 'menu-join']

  constructor() {
    super({ key: 'MenuScene' });
  }

  _displayJoinError(errorMessage) {
    let errorLabel = this._menu.getChildByID('join-error');
    if (errorMessage != null) {
      errorLabel.innerHTML = errorMessage;
      errorLabel.style.display = 'block';
    } else {
      errorLabel.style.display = 'none';
    }
  }

  create() {
    // Generate string of 5 random alphabetical letters as PeerJS identifier
    let roomCode = '';
    for (let i = 0; i < 5; i++) {
      roomCode += String.fromCharCode((Math.random()*26) + 65);
    }
    this._roomCode = roomCode;
    // Create PeerJS connector
    this._peer = new Peer(this._roomCode);
    this._peer.debug = 3;

    this._menu = this.add.dom(this.cameras.main.width / 2, this.cameras.main.height / 2).createFromCache('menu');
    this._menu.addListener('click');

    // Click callback is going to override 'this' so put it in a variable
    const this_scene = this;

    let canHost = false;

    this._menu.on('click', function(event) {
      if (event.target.name == 'menu-switch') {
        let switchTo = event.target.dataset.switchTo;

        for (let state of MenuScene.menuStates) {
          this.getChildByID(state).style.display = 'none';
        }
        this.getChildByID(switchTo).style.display = 'flex';

        // Only enable host joining if the host menu is being shown
        canHost = switchTo == 'menu-host';
      } else if (event.target.name == 'connect') {
        // Clear error message
        this_scene._displayJoinError();
        let code = this_scene._menu.getChildByID('room-code-entry').value;
        // Try to connect by room key
        let connection = this_scene._peer.connect(code.toUpperCase());
      
        connection.on('data', (data) => {
          console.log(data);
          if (data == 'ready') {
            this_scene.scene.start('MatchScene', {
              thisClientHosting: false,
              peer: this_scene._peer,
              connection: connection
            });
          } else {
            this_scene._displayJoinError(data);
          }
        })
        
      }
    });

    this._peer.on('error', (err) => {
      if (err.type == 'peer-unavailable') {
        this._displayJoinError(err);
      } else {
        alert(err);
      }
    });

    this._peer.on('open', () => {
      this._peer.on('connection', (connection) => {
        if (canHost) {
          connection.send('ready');
          this.scene.start('MatchScene', {
            thisClientHosting: true,
            peer: this._peer,
            connection: connection
          });
        } else {
          connection.send('Error: Peer is not currently hosting.');
        }
      });
    });

    this._menu.getChildByID('room-code-highlight').innerHTML = this_scene._roomCode;
    
  }
}