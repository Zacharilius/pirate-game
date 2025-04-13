import { Boot } from './Boot';

describe('Boot Scene', () => {
    let bootScene: Boot;
    let mockScene: jest.Mocked<Phaser.Scene>;

    beforeEach(() => {
        mockScene = {
            load: {
                image: jest.fn(),
            },
            scene: {
                start: jest.fn(),
            },
        } as unknown as jest.Mocked<Phaser.Scene>;

        bootScene = new Boot();
        Object.assign(bootScene, mockScene); // Mock Phaser's Scene methods
    });

    it('should start the Preloader scene in create()', () => {
        bootScene.create();
        expect(mockScene.scene.start).toHaveBeenCalledWith('Preloader');
    });
});
