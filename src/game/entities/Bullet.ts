import { Graphics } from 'pixi.js';

export class Bullet extends Graphics {
    speed = 12;
    isAlive = true;

    constructor(x: number, y: number) {
        super();

        this.rect(-2, -10, 4, 20);
        this.fill(0xffffff);

        this.x = x;
        this.y = y;
    }

    update(): void {
        this.y -= this.speed;

        if (this.y < -50) {
            this.isAlive = false;
        }
    }
}