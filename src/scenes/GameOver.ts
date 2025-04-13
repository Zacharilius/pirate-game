import { Scene } from 'phaser';

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera | undefined;

    constructor () {
        super('GameOver');
    }

    create () {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        const { width, height } = this.scale
        const gameover_text = this.add.text(width / 2, height / 2, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        gameover_text.setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
