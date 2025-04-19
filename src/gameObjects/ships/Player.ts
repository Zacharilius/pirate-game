import Phaser from "phaser";
import { BaseShip } from "./BaseShip";

export const CANNON_RADIAN_OFFSET = 0.7;

export class Player extends BaseShip {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'ship (2).png');
        this.scale = 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }

    public die() {
        this.setActive(false)
        this.setVisible(false);
        this.setVelocity(0); // Stop its movement
        this.scene.events.emit('playerDied');
    }

    public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.setVelocity(0);

        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setAngle(90);
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setAngle(270);
        }

        if (cursors.up.isDown) {
            this.setVelocityY(-this.speed);
            this.setAngle(180);
        } else if (cursors.down.isDown) {
            this.setVelocityY(this.speed);
            this.setAngle(0);
        }

        this.updateBoundingBox();

        // When moving diagonally, reduce speed because traveling both x & y.
        if (this.body?.velocity.x !== 0 && this.body?.velocity.y !== 0) {
            this.body?.velocity.normalize().scale(this.speed);
        }
    }
}
