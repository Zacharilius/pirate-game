import Phaser from "phaser";
import { BaseEnemyShip, EnemyPath } from "./BaseEnemyShip";
import { getTargetPosition } from "./type";

const HEALTH = 3;

const SHIP_PATH: EnemyPath[] = [
    { x: 400, y: 50, angle: 90},
    { x: 1000, y: 50, angle: 270},
];

export class SwordsEnemyShip extends BaseEnemyShip {
    constructor(scene: Phaser.Scene, getPosition: getTargetPosition) {
        super(scene, 'ship (4).png', SHIP_PATH, HEALTH, getPosition);
    }
}
