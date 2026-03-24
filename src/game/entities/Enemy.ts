import { Sprite, type Texture } from 'pixi.js';

export class Enemy extends Sprite {
    speed = 2.5;
    isAlive = true;
    hitRadius = 65;

    constructor(texture: Texture, x: number, y: number) {
        super(texture);

        this.anchor.set(0.5);
        this.x = x;
        this.y = y;
    }

    update(viewHeight: number): void {
        this.y += this.speed;

        if (this.y > viewHeight + 100) {
            this.isAlive = false;
        }
    }
}