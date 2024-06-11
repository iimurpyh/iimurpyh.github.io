export default class Hitbox extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, offsetX, offsetY, w, h) {
        super(scene, 0, 0, 'hitbox');
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = w;
        this.height = h;
        scene.physics.add.existing(this);
        this.body.setSize(w, h);
    }
}