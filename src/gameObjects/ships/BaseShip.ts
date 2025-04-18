export class BaseShip extends Phaser.Physics.Arcade.Sprite {
    protected speed = 100;

    constructor(scene: Phaser.Scene, x: number, y: number, spriteName: string) {
        super(scene, x, y, 'shipSheet', spriteName);
        this.scale = 0.5;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
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
