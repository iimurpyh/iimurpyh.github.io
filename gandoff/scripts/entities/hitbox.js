export default class Hitbox extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, offsetX, offsetY, w, h) {
        super(scene, 0, 0, 'hitbox');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }
}