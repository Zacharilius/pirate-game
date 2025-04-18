import { BaseShip } from "../BaseShip";

export interface EnemyPath {
    x: number;
    y: number;
    angle: number;
}

export class BaseEnemyShip extends BaseShip {
    private health: number;
    private maxHealth: number;
    protected speed = 50;
    private currentPathIndex: number = 0;
    private path: EnemyPath[];

    constructor(scene: Phaser.Scene, shipName: string, path: EnemyPath[], health: number) {
        super(scene, path[0].x, path[0].y, shipName);
        this.maxHealth = health;
        this.health = health;
        this.path = path;
        this.randomizeCurrentPathIndex();
        const position = this.getCurrentPathTarget();
        this.setPosition(position.x, position.y);
        this.scale = 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }

    update() {
        const target = this.getCurrentPathTarget();
        const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
        if (distance < 5) { // Reached the current point (small tolerance)
            this.currentPathIndex = (this.currentPathIndex + 1) % this.path.length;
            this.moveToNextPatrolPoint();
        } else {
            this.scene.physics.moveToObject(this, target, this.speed);
        }
        this.setAngle(target.angle);

        this.updateBoundingBox();
    }

    moveToNextPatrolPoint() {
        const target = this.path[this.currentPathIndex];
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
        this.health = this.maxHealth;
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

    private randomizeCurrentPathIndex = () => {
        this.currentPathIndex = Math.floor(Math.random() * this.path.length)
    }

    private getCurrentPathTarget () {
        return this.path[this.currentPathIndex];
    }
}
