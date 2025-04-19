import { Scene } from 'phaser';

export class Winner extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera | undefined;

    constructor () {
        super('Winner');
    }

    create () {
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0x008000);

        const { width, height } = this.scale
        const winnerText = this.add.text(width / 2, height / 2, 'Master in Commander', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        winnerText.setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
