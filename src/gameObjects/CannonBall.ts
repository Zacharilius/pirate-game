import Phaser from "phaser";

export const CANNON_BALL_RANGE = 150;

export class CannonBall extends Phaser.Physics.Arcade.Sprite {
    private cannonBallSpeed = 200;
    private cannonBallRange = CANNON_BALL_RANGE;
    private damage = 1;
    private cannonFireSound: Phaser.Sound.NoAudioSound | Phaser.Sound.HTML5AudioSound | Phaser.Sound.WebAudioSound | undefined;


    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'shipSheet', 'cannonBall.png');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(false);

        // Audio
        this.cannonFireSound = this.scene.sound.add('cannonFire', { volume: 0.2 });
    }
    public init(angle: number) {
        this.setVelocityX(Math.cos(angle) * this.cannonBallSpeed);
        this.setVelocityY(Math.sin(angle) * this.cannonBallSpeed);
        this.setData('startX', this.x);
        this.setData('startY', this.y);
        this.cannonFireSound?.play();
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
