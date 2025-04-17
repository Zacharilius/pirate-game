import { Scene } from 'phaser';
import { Player } from '../gameObjects/Player';
import { CannonBall } from '../gameObjects/CannonBall';

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
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
]

export class Game extends Scene {
    private player: Player | undefined;
    private mainCamera: Phaser.Cameras.Scene2D.Camera | undefined;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

    private cannonBalls: Phaser.Physics.Arcade.Group | undefined;


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
        this.player = new Player(this, 25, 25);

        // Collisions
        this.physics.add.collider(this.player, this.backgroundTileGroup as Phaser.Physics.Arcade.StaticGroup);

        // Camera setup
        this.mainCamera = this.cameras.main;
        this.mainCamera.startFollow(this.player);
        this.mainCamera.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
        this.mainCamera.setZoom(2);

        // Cursors
        this.cursors = this.input.keyboard?.createCursorKeys();

        // Cannonball
        this.cannonBalls = this.physics.add.group();
        this.input.keyboard?.on('keydown', (event) => {
            if (event.code === 'Space') {
                this.shoot();
            }
        });
    }

   private shoot() {
        let cannonBall: CannonBall = this.cannonBalls?.getFirst();
        if (cannonBall) {
            // Reuse the cannonball if available.
            cannonBall.setActive(true).setVisible(true);
            cannonBall.setPosition(this.player?.x as number, this.player?.y as number);
            cannonBall.init(this.player?.rotation as number);
        } else {
            cannonBall = new CannonBall(this, this.player?.x as number, this.player?.y as number );
            this.cannonBalls?.add(cannonBall);
            // When a sprite is added to a group, it sets the velocity to 0. So
            // initalize after added to the group.
            cannonBall.init(this.player?.rotation as number);
        }
    }

    update( ) {
        if (!this.player || !this.cursors) {
            return;
        }

        this.player.update(this.cursors);

        this.cannonBalls?.getChildren().forEach((cannonBallGameObject: Phaser.GameObjects.GameObject) => {
            const cannonBall = cannonBallGameObject as CannonBall;
            cannonBall.update();
        });
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
