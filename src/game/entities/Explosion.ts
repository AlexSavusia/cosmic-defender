import { Container, Graphics } from 'pixi.js';

export class Explosion extends Container {
    private readonly circle: Graphics;
    private elapsed = 0;
    private readonly duration = 250;

    isAlive = true;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;

        this.circle = new Graphics();
        this.addChild(this.circle);

        this.renderFrame(0);
    }

    reset(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.elapsed = 0;
        this.isAlive = true;
    }

    update(deltaMs: number): void {
        this.elapsed += deltaMs;

        const progress = Math.min(this.elapsed / this.duration, 1);
        this.renderFrame(progress);

        if (progress >= 1) {
            this.isAlive = false;
        }
    }

    private renderFrame(progress: number): void {
        const radius = 10 + progress * 30;
        const alpha = 1 - progress;

        this.circle.clear();
        this.circle.circle(0, 0, radius);
        this.circle.fill({ color: 0xffcc66, alpha });

        this.circle.circle(0, 0, radius * 0.55);
        this.circle.fill({ color: 0xff6633, alpha: alpha * 0.9 });

        this.circle.circle(0, 0, radius * 0.25);
        this.circle.fill({ color: 0xffffff, alpha: alpha * 0.95 });
    }
}