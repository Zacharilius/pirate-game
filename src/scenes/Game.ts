import { Scene } from 'phaser';
import { CANNON_RADIAN_OFFSET, Player } from '../gameObjects/ships/Player';
import { CannonBall } from '../gameObjects/CannonBall';
import { CrossShip } from '../gameObjects/ships/enemies/CrossShip';
import { BaseEnemyShip } from '../gameObjects/ships/enemies/BaseEnemyShip';
import { BaseShip } from '../gameObjects/ships/BaseShip';

// Each tile in the background tile sprite is 64 width and height.
const BACKGROUND_DIMENSION_PIXELS = 64;

// -1 is no tile (water). The other numbers correspond to indexes in the tilesheet
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
    private inputA: Phaser.Input.Keyboard.Key | undefined;
    private inputD: Phaser.Input.Keyboard.Key | undefined;

    private cannonBalls: Phaser.Physics.Arcade.Group | undefined;
    private lastCannonBallTime: number = 0;
    private cannonBallDelay: number = 1000;

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
        this.inputA = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.inputD = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D);

        // Cannonball
        this.cannonBalls = this.physics.add.group();
        this.physics.add.collider(this.cannonBalls, this.enemies, this.handleCannonBallHit as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);
        this.physics.add.collider(this.cannonBalls, this.player, this.handleCannonBallHitPlayer as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback, undefined, this);

        // FIXME: shoot uses player rotation, but enemies use angle.
        this.events.on('enemyFireCannonBall', (enemy: BaseEnemyShip) => {
            const rotation = enemy.angle * Math.PI / 180;
            this.shoot(rotation, enemy.x, enemy.y);
        });

        this.events.on('playerDied', () => {
            this.physics.pause();

            this.time.delayedCall(2000, () => {
                this.scene.start('GameOver');
            });
        });
    }

    // The order of the paramaters is switched when using enemies vs plauer so
    // this is a hack to get handleCannonballHit to work for both.
    private handleCannonBallHitPlayer(player: Player, cannonBall: CannonBall) {
        return this.handleCannonBallHit(cannonBall, player);
    }

    private handleCannonBallHit(cannonBall: CannonBall, ship: BaseShip) {
        // takeDamage moves the enemy off screen so store original hit position to place the explosion correctly.
        const x = ship.x;
        const y = ship.y;
        ship.takeDamage(cannonBall.getDamage());
        if (ship.getHealth() <= 0) {
            ship.destroy();
            // Show fire for 1 second.
            const tempSprite = this.add.sprite(x, y,  'shipSheet', 'explosion3.png');
            this.time.delayedCall(1000, () => {
                tempSprite.destroy();
            });
        } else {
            ship.setTint(0xff0000);
            this.time.delayedCall(1000, () => {
                if (ship.getHealth() > 0) {
                    ship.setTint();
                }
            });

        }
        cannonBall.setInactive();
    };

    update(time: number) {
        if (time > this.lastCannonBallTime + this.cannonBallDelay) {
            if (this.inputA?.isDown) {
                this.shootPort(this.player.x as number, this.player.y as number);
                this.lastCannonBallTime = time;
            } else if (this.inputD?.isDown) {
                this.shootStarboard(this.player.x as number, this.player.y as number);
                this.lastCannonBallTime = time;
            }
        }

        this.player?.update(this.cursors as Phaser.Types.Input.Keyboard.CursorKeys);

        this.enemies?.getChildren().forEach((baseEnemyShipGameObject: Phaser.GameObjects.GameObject) => {
            const baseEnemyShip = baseEnemyShipGameObject as BaseEnemyShip;
            baseEnemyShip.update(time);
        });

        this.cannonBalls?.getChildren().forEach((cannonBallGameObject: Phaser.GameObjects.GameObject) => {
            const cannonBall = cannonBallGameObject as CannonBall;
            cannonBall.update();
        });
    }

    private shootPort(x: number, y: number) {
        const rotationOffset = CANNON_RADIAN_OFFSET;
        const rotation = this.player?.rotation as number;
        this.shoot(rotation + rotationOffset, x, y);
    }

    private shootStarboard(x: number, y: number) {
        const rotationOffset = -CANNON_RADIAN_OFFSET + Math.PI;
        const rotation = this.player?.rotation as number
        this.shoot(rotation + rotationOffset, x, y);
    }

   private shoot(rotation: number, x: number, y: number) {
        let cannonBall: CannonBall = this.cannonBalls?.getFirst();
        if (cannonBall) {
            // Reuse the cannonball if available.
            cannonBall.setActive(true).setVisible(true);
            cannonBall.setPosition(x, y);
            cannonBall.init(rotation);
        } else {
            cannonBall = new CannonBall(this, x, y);
            this.cannonBalls?.add(cannonBall);
            // When a sprite is added to a group, it sets the velocity to 0. So
            // initalize after added to the group.
            cannonBall.init(rotation);
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
