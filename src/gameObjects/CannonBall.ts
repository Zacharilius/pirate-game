import Phaser from "phaser";

export class CannonBall extends Phaser.Physics.Arcade.Sprite {
    private cannonBallSpeed = 200;
    private cannonBallFireRate = 1000; // milliseconds
    private cannonBallDamage = 10;
    private cannonBallRange = 100; // pixels

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'shipSheet', 'cannonBall.png');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);

    }
    public init() {
        const speed = 300; // Adjust bullet speed
        const angle = 0; // Adjust for shooting direction (e.g., player's facing)
        this.setVelocityX(Math.cos(angle) * speed);
        this.setVelocityY(Math.sin(angle) * speed);
        this.setData('startX', this.x);
        this.setData('startY', this.y);
    }

    update () {
        if (this.active) {
            const startX = this.getData('startX');
            const startY = this.getData('startY');
            const distanceTraveled = Phaser.Math.Distance.Between(startX, startY, this.x, this.y);

            // TODO: Try to reuse these cannon balls instead of creating new ones.
            if (distanceTraveled >= this.cannonBallRange) {
                this.setActive(false).setVisible(false);
                this.setVelocity(0); // Stop its movement
                this.setPosition(-100, -100); // Move it off-screen for reuse
            }
        }
    }
}
