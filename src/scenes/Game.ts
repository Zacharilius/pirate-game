import { Scene } from 'phaser';
import { CANNON_RADIAN_OFFSET, Player } from '../gameObjects/Player';
import { CannonBall } from '../gameObjects/CannonBall';
import { CrossShip } from '../gameObjects/CrossShip';

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
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1,  0,  1,  2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, 16, 17, 18, -1, -1, -1, -1, -1, -1,  0,  1,  2, -1, -1],
    [-1, -1, -1, -1, 32, 33, 34, -1, -1, -1, -1, -1, -1, 16, 17, 18, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 32, 33, 34, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1,  5,  6,  7,  7,  8, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 21, 22, 23, 23, 24, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 37, 38, 39, 39, 40, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 37, 38, 39, 39, 40, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, 53, 54, 55, 55, 56, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
]

export class Game extends Scene {
    private player: Player | undefined;
    private enemies: Phaser.Physics.Arcade.Group | undefined;
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
        this.physics.add.collider(this.player, this.backgroundTileGroup as Phaser.Physics.Arcade.StaticGroup);

        // Enemies
        this.enemies = this.physics.add.group();
        this.physics.add.collider(this.enemies, this.backgroundTileGroup as Phaser.Physics.Arcade.StaticGroup);
        this.physics.add.collider(this.enemies, this.player);
        const enemyCrossShip = new CrossShip(this);
        this.enemies?.add(enemyCrossShip);

        // Camera setup
        this.mainCamera = this.cameras.main;
        this.mainCamera.startFollow(this.player);
        this.mainCamera.setBounds(0, 0, this.physics.world.bounds.width, this.physics.world.bounds.height);
        this.mainCamera.setZoom(2);

        // Cursors
        this.cursors = this.input.keyboard?.createCursorKeys();

        // Cannonball
        this.cannonBalls = this.physics.add.group();
        this.input.keyboard?.on('keydown', (event: KeyboardEvent) => {
            if (event.code === "KeyA") {
                this.shootLeft();
            }
            if (event.code === "KeyD") {
                this.shootRight();
            }
        });

        this.physics.add.collider(this.cannonBalls, this.enemies, this.handleEnemyHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
    }

    private handleEnemyHit(cannonBall: CannonBall, enemy: CrossShip) {
        // Do not move when hit.
        const enemyX = enemy.x;
        const enemyY = enemy.y;
        enemy.takeDamage(cannonBall.getDamage());
        if (enemy.getHealth() <= 0) {
            // Show fire for 1 second.
            const tempSprite = this.add.sprite(enemyX, enemyY,  'shipSheet', 'explosion3.png');
            this.time.delayedCall(1000, () => {
                tempSprite.destroy();
                const firstEnemy: CrossShip = this.enemies?.getFirst();
                firstEnemy?.revive();
            });
        } else {
            enemy.setTint(0xff0000);
            this.time.delayedCall(1000, () => {
                if (enemy.getHealth() > 0) {
                    enemy.setTint();
                }
            });

        }
        cannonBall.setInactive();
    };

    private shootLeft() {
        const rotationOffset = CANNON_RADIAN_OFFSET;
        const rotation = this.player?.rotation as number;
        this.shoot(rotation + rotationOffset);
    }

    private shootRight() {
        const rotationOffset = -CANNON_RADIAN_OFFSET + Math.PI;
        const rotation = this.player?.rotation as number
        this.shoot(rotation + rotationOffset);
    }

   private shoot(rotation: number) {
        let cannonBall: CannonBall = this.cannonBalls?.getFirst();
        if (cannonBall) {
            // Reuse the cannonball if available.
            cannonBall.setActive(true).setVisible(true);
            cannonBall.setPosition(this.player?.x as number, this.player?.y as number);
            cannonBall.init(rotation);
        } else {
            cannonBall = new CannonBall(this, this.player?.x as number, this.player?.y as number);
            this.cannonBalls?.add(cannonBall);
            // When a sprite is added to a group, it sets the velocity to 0. So
            // initalize after added to the group.
            cannonBall.init(rotation);
        }
    }

    update() {
        if (!this.player || !this.cursors) {
            return;
        }

        this.player.update(this.cursors);

        this.enemies?.getChildren().forEach((crossShipGameObject: Phaser.GameObjects.GameObject) => {
            const crossShip = crossShipGameObject as CrossShip;
            crossShip.update();
        });

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
