import Phaser from "phaser";

const HEALTH = 3;

export class CrossShip extends Phaser.Physics.Arcade.Sprite {
    private health = HEALTH;

    private speed = 200;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'shipSheet', 'ship (1).png');
        this.scale = 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
    }

    public update(cursors: Phaser.Types.Input.Keyboard.CursorKeys) {
        this.setVelocity(0);

        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setAngle(90);
            this.setBoundingBoxForHorizontal();
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setAngle(270);
            this.setBoundingBoxForHorizontal();
        }

        if (cursors.up.isDown) {
            this.setVelocityY(-this.speed);
            this.setAngle(180);
            this.setBoundingBoxForVertical();
        } else if (cursors.down.isDown) {
            this.setVelocityY(this.speed);
            this.setAngle(0);
            this.setBoundingBoxForVertical();
        }

        // When moving diagonally, reduce speed because traveling both x & y.
        if (this.body?.velocity.x !== 0 && this.body?.velocity.y !== 0) {
            this.body?.velocity.normalize().scale(this.speed);
        }
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
        this.setPosition(250, 250);
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
}
