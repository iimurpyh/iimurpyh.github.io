import Enum from '../enum.js';
import Constants from '../constants.js';

let PlayerInfo;
let JoinInfo;

protobuf.load('assets/text/playerInfo.proto', function(error, root) {
  if (error) {
      throw error;
  }

  PlayerInfo = root;
  JoinInfo = PlayerInfo.lookupType('playerinfo.JoinInfo');
});

function colorStringToInt(col) {
  return (parseInt(col.substr(1), 16) << 8) / 256;
}

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

  _packConnectionMessage(msg) {
    let message = JoinInfo.create(msg);
    return JoinInfo.encode(message).finish();
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
        let code = this.getChildByID('room-code-entry').value;
        // Try to connect by room key
        let connection = this_scene._peer.connect(code.toUpperCase());
        let playerColor = colorStringToInt(this.getChildByID('player-color').value);

        connection.on('open', () => {
          connection.send(this_scene._packConnectionMessage({
            status: Enum.ConnectionStatus.SUCCESS,
            playerColor: playerColor
          }))
        })
      
        connection.on('data', (data) => {
          let array = new Uint8Array(data);
          let info = JoinInfo.decode(array);
          if (info.status == Enum.ConnectionStatus.SUCCESS) {
            this_scene._peer.off('open');
            this_scene._peer.off('connection');
            connection.off('data');
            this_scene.scene.start('MatchScene', {
              thisClientHosting: false,
              peer: this_scene._peer,
              connection: connection,
              connectionMessage: info,
              color: playerColor
            });
          } else {
            this_scene._displayJoinError(Constants.ConnectionErrorMessages[info.status]);
          }
        });
        
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
        connection.on('data', (data) => {
          if (!canHost) {
            console.log('sending denial');
            connection.send(this._packConnectionMessage({
              status: Enum.ConnectionStatus.NOT_HOSTING,
              playerColor: 0xFFFFFF
            }));
            return;
          }
          let array = new Uint8Array(data);
          let info = JoinInfo.decode(array);

          if (info.status == Enum.ConnectionStatus.SUCCESS) {
            let playerColor = colorStringToInt(this._menu.getChildByID('player-color').value);
            this._peer.off('open');
            this._peer.off('connection');
            connection.off('data');
            connection.send(this._packConnectionMessage({
              status: Enum.ConnectionStatus.SUCCESS,
              playerColor: playerColor
            }))
            this.scene.start('MatchScene', {
              thisClientHosting: true,
              peer: this._peer,
              connection: connection,
              connectionMessage: info,
              color: playerColor
            });
          }
        })
      });
    });

    this._menu.getChildByID('room-code-highlight').innerHTML = this._roomCode;
    // Randomize player color
    this._menu.getChildByID('player-color').value = '#' + Math.floor(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    
  }
}