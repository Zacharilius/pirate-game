import Phaser from "phaser";

export class CannonBall extends Phaser.Physics.Arcade.Sprite {
    private cannonBallSpeed = 300;
    private cannonBallRange = 150;
    private damage = 1;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'shipSheet', 'cannonBall.png');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);

    }
    public init(angle: number) {
        this.setVelocityX(Math.cos(angle) * this.cannonBallSpeed);
        this.setVelocityY(Math.sin(angle) * this.cannonBallSpeed);
        this.setData('startX', this.x);
        this.setData('startY', this.y);
    }

    public getDamage() {
        return this.damage
    }

    public update () {
        if (this.active) {
            const startX = this.getData('startX');
            const startY = this.getData('startY');
            const distanceTraveled = Phaser.Math.Distance.Between(startX, startY, this.x, this.y);

            if (distanceTraveled >= this.cannonBallRange) {
                this.setInactive();
            }
        }
    }

    public setInactive() {
        this.setActive(false).setVisible(false);
        this.setVelocity(0); // Stop its movement
        this.setPosition(-100, -100); // Move it off-screen for reuse
    }
}
