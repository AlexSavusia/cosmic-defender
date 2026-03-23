import { Sprite, type Texture } from 'pixi.js';

export class Player extends Sprite {
    speed = 8;

    constructor(texture: Texture) {
        super(texture);

        this.anchor.set(0.5);
        this.scale.set(1);
    }

    moveLeft(minX: number): void {
        this.x = Math.max(minX, this.x - this.speed);
    }

    moveRight(maxX: number): void {
        this.x = Math.min(maxX, this.x + this.speed);
    }
}