import { HorseSprites } from "./gameObjects/horseSprites";

const DEFAULT_STATE = {
    horseSprite: HorseSprites.whiteBodyWhiteManeHorse,
}

const state = {
    ...DEFAULT_STATE,
};

export const getSelectedSprite = (): HorseSprites => {
    return state.horseSprite;
}

export const updateSelectedSprite = (sprite: HorseSprites): void => {
    state.horseSprite = sprite;
}
