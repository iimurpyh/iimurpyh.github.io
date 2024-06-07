export default class Hitbox extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, offsetX, offsetY, w, h) {
        super(scene, offsetX, offsetY, 'hitbox');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }
}