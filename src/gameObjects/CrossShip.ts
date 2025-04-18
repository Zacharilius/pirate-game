import Phaser from "phaser";

const HEALTH = 3;

const PATH = [
    { x: 200, y: 75 },
    { x: 200, y: 400 },
    { x: 600, y: 400 },
    { x: 600, y: 75 },
];

export class CrossShip extends Phaser.Physics.Arcade.Sprite {
    private health = HEALTH;
    private speed = 50;
    private currentPathIndex: number = 0;

    constructor(scene: Phaser.Scene) {
        super(scene, PATH[0].x, PATH[0].y, 'shipSheet', 'ship (1).png');
        this.randomizeCurrentPathIndex();
        const path = this.getCurrentPathTarget();
        this.setPosition(path.x, path.y);
        this.scale = 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }

    private getCurrentPathTarget () {
        return PATH[this.currentPathIndex];
    }

    update() {
        const target = this.getCurrentPathTarget();
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        if (distance < 5) { // Reached the current point (small tolerance)
            this.currentPathIndex = (this.currentPathIndex + 1) % PATH.length;
            this.moveToNextPatrolPoint();
        } else {
            this.scene.physics.moveToObject(this, target, this.speed);
        }
    }

    moveToNextPatrolPoint() {
        const target = PATH[this.currentPathIndex];
        this.scene.physics.moveToObject(this, target, this.speed);
    }

    public getHealth() {
        return this.health;
    }

    public takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.die();
        }
    }

    public resetHealth() {
        this.health = HEALTH;
    }

    public die() {
        this.setActive(false)
        this.setVisible(false);
        this.setVelocity(0); // Stop its movement
        this.setPosition(-100, -100); // Move it off-screen for reuse

    }

    public revive() {
        this.setActive(true);
        this.setVisible(true);
        this.randomizeCurrentPathIndex();
        const path = this.getCurrentPathTarget();
        this.setPosition(path.x, path.y);
        this.resetHealth();
        this.setTint();
    }

    // Makes the physics body match the sprite image.
    private setBoundingBoxForHorizontal() {
        this.setSize(100, 50);
    }

    // Makes the physics body match the sprite image.
    private setBoundingBoxForVertical() {
        this.setSize(50, 100);
    }

    private randomizeCurrentPathIndex = () => {
        this.currentPathIndex = Math.floor(Math.random() * PATH.length)
    }
}
