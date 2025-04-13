import { Scene } from 'phaser';

export class MainMenu extends Scene{

    constructor () {
        super('MainMenu');
    }

    create () {
        const { width, height } = this.scale;
        this.add.text(width / 2, height / 2, 'Pirates', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });

        this.input.once('pointerdown', () => {
            this.scene.start('Game');
        });

        // FIXME: Put back
        this.scene.start('Game');
    }
}
