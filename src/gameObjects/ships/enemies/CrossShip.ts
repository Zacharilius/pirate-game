import Phaser from "phaser";
import { BaseEnemyShip, EnemyPath } from "./BaseEnemyShip";
import { getTargetPosition } from "./type";

const HEALTH = 3;

const CROSS_SHIP_PATH: EnemyPath[] = [
    { x: 200, y: 75, angle: 90},
    { x: 200, y: 400, angle: 0},
    { x: 600, y: 400, angle: 270},
    { x: 600, y: 75, angle: 180},
];

export class CrossShip extends BaseEnemyShip {
    constructor(scene: Phaser.Scene, getPosition: getTargetPosition) {
        super(scene, 'ship (3).png', CROSS_SHIP_PATH, HEALTH, getPosition);
    }
}
