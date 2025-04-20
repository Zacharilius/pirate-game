import { Scene } from 'phaser';

export class MainMenu extends Scene{

    constructor () {
        super('MainMenu');
    }

    create () {
        const { width, height } = this.scale;

        const mainMenuText = this.add.text(width / 2, height / 2, 'Pirates', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        mainMenuText.setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}
