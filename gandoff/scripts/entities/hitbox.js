export default class Hitbox extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, offsetX, offsetY, w, h) {
        let x = player.x + offsetX
        let y = player.y + offsetY
        super(scene, x, y, 'hitbox');
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
}