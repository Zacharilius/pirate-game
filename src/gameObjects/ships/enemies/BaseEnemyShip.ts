import { BaseShip } from "../BaseShip";

export interface EnemyPath {
    x: number;
    y: number;
    angle: number;
}

export class BaseEnemyShip extends BaseShip {
    protected speed = 50;
    private currentPathIndex: number = 0;
    private path: EnemyPath[];

    private lastCannonBallTime: number = 0;
    private cannonBallDelay: number = 1000;

    private updateCallCount = 0;

    constructor(scene: Phaser.Scene, shipName: string, path: EnemyPath[], health: number) {
        super(scene, path[0].x, path[0].y, shipName, health);
        this.path = path;
        this.randomizeCurrentPathIndex();
        const position = this.getCurrentPathTarget();
        this.setPosition(position.x, position.y);
        this.scale = 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }

    public update(time: number) {
        if (!this.active) {
            return;
        }

        if (!this.isFirstCall() && time > this.lastCannonBallTime + this.cannonBallDelay) {
            console.log('fireCannonBall');
            this.fireCannonBall();
            this.lastCannonBallTime = time;
        }

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

    // On init, there's a race condition where the cannon fires but the update to move the 
    // ship hasn't called causing the enemy ships to take damage.
    private isFirstCall() {
        const CALLS_TO_DELAY = 1;
        if (this.updateCallCount > CALLS_TO_DELAY) {
            return false
        } else {
            this.updateCallCount += 1;
            return true;
        }
    }

    public moveToNextPatrolPoint() {
        const target = this.path[this.currentPathIndex];
        this.scene.physics.moveToObject(this, target, this.speed);
    }

    public fireCannonBall() {
        this.scene.events.emit('enemyFireCannonBall', this);
    }

    public resetHealth() {
        this.health = this.maxHealth;
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
