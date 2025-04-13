import { Scene } from 'phaser';
import { Player } from '../gameObjects/Player';

// Each tile in the background tile sprite is 64 width and height.
const BACKGROUND_DIMENSION_PIXELS = 64;

// -1 Not a tile... water
// 0 - Sand top, left
// 1 - Sand top
// 2 - Sand top, right

// 16 Sand Middle, left middle
// 17 Sand Middle, middle middle
// 18 Sand Middle, right middle

// 32 Sand Bottom, left
// 33 Sand Bottom, middle
// 34 Sand Bottom, right
const tiles = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1,  0,  1,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 16, 17, 18, -1, -1, -1, -1, -1, -1,  0,  1,  2, -1, -1],
    [-1, -1, -1, -1, 32, 33, 34, -1, -1, -1, -1, -1, -1, 16, 17, 18, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 32, 33, 34, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1,  0,  1,  1,  1, 2, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 16, 17, 17, 17, 18, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 16, 17, 17, 17, 18, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 32, 33, 33, 33, 34, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
]

export class Game extends Scene {
    private player: Player | undefined;
    private mainCamera: Phaser.Cameras.Scene2D.Camera | undefined;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private playerSpeed = 200;

    private backgroundTileGroup: Phaser.Physics.Arcade.StaticGroup | undefined;

    constructor () {
        super('Game');
    }

    create () {
        const worldWidth = BACKGROUND_DIMENSION_PIXELS * tiles[0].length;
        const worldHeight = BACKGROUND_DIMENSION_PIXELS * tiles.length;
    
        // Resize the physics world bounds
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);

        // Background
        this.setupBackground();

        // Player
        this.player = new Player(this, 0, 0);

        // Collisions
        this.physics.add.collider(this.player, this.backgroundTileGroup as Phaser.Physics.Arcade.StaticGroup);

        // Camera setup
        this.mainCamera = this.cameras.main;
        this.mainCamera.startFollow(this.player);
        this.mainCamera.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
        this.mainCamera.setZoom(2);

        // Cursors
        this.cursors = this.input.keyboard?.createCursorKeys();
    }

    update() {
        if (!this.player || !this.cursors) {
            return;
        }
        this.player.setVelocity(0);
    
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed);
            this.player.angle = 90;
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.angle = 270;
        }
    
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-this.playerSpeed);
            this.player.angle = 180;
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(this.playerSpeed);
            this.player.angle = 0;
        }

        // When moving diagonally, reduce speed because traveling both x & y.
        if (this.player.body.velocity.x !== 0 && this.player.body.velocity.y !== 0) {
            this.player.body.velocity.normalize().scale(this.playerSpeed);
        }
    }

    private setupBackground () {
        this.backgroundTileGroup = this.physics.add.staticGroup();
        for (let rowIndex = 0; rowIndex < tiles.length; rowIndex += 1) {
            for (let colIndex = 0; colIndex < tiles[0].length; colIndex += 1) {
                if (tiles[rowIndex][colIndex] === -1) {
                    // ignore water
                } else {
                    this.backgroundTileGroup.add(this.add.sprite(
                        colIndex * BACKGROUND_DIMENSION_PIXELS + (BACKGROUND_DIMENSION_PIXELS / 2),
                        rowIndex * BACKGROUND_DIMENSION_PIXELS + (BACKGROUND_DIMENSION_PIXELS / 2),
                        'tileSheet',
                        tiles[rowIndex][colIndex]
                    ));
                }
            }
        }
    }
}
