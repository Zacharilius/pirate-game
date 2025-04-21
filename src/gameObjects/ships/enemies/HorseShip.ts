import Phaser from "phaser";
import { BaseEnemyShip, EnemyPath } from "./BaseEnemyShip";
import { getTargetPosition } from "./type";

const HEALTH = 3;

const SHIP_PATH: EnemyPath[] = [
    { x: 150, y: 200, angle: 180 },
    { x: 150, y: 800, angle: 0 },
];

export class HorseShip extends BaseEnemyShip {
    constructor(scene: Phaser.Scene, getPosition: getTargetPosition) {
        super(scene, 'ship (5).png', SHIP_PATH, HEALTH, getPosition);
    }
}
