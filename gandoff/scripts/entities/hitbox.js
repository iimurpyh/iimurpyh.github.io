export default class Hitbox extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, offsetX, offsetY, w, h) {
        super(scene, offsetX, offsetY, 'hitbox');
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.w = w;
        this.h = h;
        scene.physics.add.existing(this, true);
    }
}