export default class Player extends Phaser.Physics.Arcade.Sprite {
  jump() {
    this.setVelocityY(-400)
  }

  constructor(scene, x, y) {
    super(scene, x, y, 'player')
    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
      .setInteractive()
      
    scene.input.keyboard.on('keydown-W', () => {
      this.jump();
    });
    
  }
}
