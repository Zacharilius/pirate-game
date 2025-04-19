export class BaseShip extends Phaser.Physics.Arcade.Sprite {
    protected health: number;
    protected maxHealth: number;

    protected speed = 100;

    constructor(scene: Phaser.Scene, x: number, y: number, spriteName: string, health: number = 3) {
        super(scene, x, y, 'shipSheet', spriteName);
        this.health = health;
        this.maxHealth = health;
        this.scale = 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
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

    public die() {
        this.setActive(false)
        this.setVisible(false);
        this.setVelocity(0);
        this.setPosition(-100, -100); // Move it off-screen for reuse
    }

    protected updateBoundingBox() {
        const horizontalAngles = new Set([0, 180]);
        if (horizontalAngles.has(Math.abs(this.angle))) {
            this.setBoundingBoxForVertical();
        } else {
            this.setBoundingBoxForHorizontal();
        }
    }

    // Makes the physics body match the sprite image.
    private setBoundingBoxForHorizontal() {
        this.setSize(100, 50);
    }

    // Makes the physics body match the sprite image.
    private setBoundingBoxForVertical() {
        this.setSize(50, 100);
    }
}
