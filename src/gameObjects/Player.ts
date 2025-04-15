import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'shipSheet', 'ship (2).png');
        this.scale = 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }
}
