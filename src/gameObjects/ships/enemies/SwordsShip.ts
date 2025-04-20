import Phaser from "phaser";
import { BaseEnemyShip, EnemyPath } from "./BaseEnemyShip";

const HEALTH = 3;

const SHIP_PATH: EnemyPath[] = [
    { x: 400, y: 50, angle: 90},
    { x: 1000, y: 50, angle: 270},
];

export class SwordsEnemyShip extends BaseEnemyShip {
    constructor(scene: Phaser.Scene) {
        super(scene, 'ship (4).png', SHIP_PATH, HEALTH);
    }
}
