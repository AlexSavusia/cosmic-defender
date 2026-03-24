import { Application } from 'pixi.js';
import { GAME_CONFIG } from '../../shared/config/gameConfig';
import { AssetManager } from './AssetsManager';
import { InputController } from './InputController';
import { SoundManager } from './SoundManager';
import { MainScene } from '../scene/MainScene';

export class Game {
    private app: Application | null = null;
    private container: HTMLElement | null = null;
    private canvas: HTMLCanvasElement | null = null;

    private readonly assets = new AssetManager();
    private readonly input = new InputController();
    private readonly sound = new SoundManager();

    private scene: MainScene | null = null;

    private destroyed = false;
    private mounted = false;
    private ready = false;

    private resizeRaf: number | null = null;

    async mount(container: HTMLElement): Promise<void> {
        if (this.mounted || this.destroyed) return;

        this.container = container;

        const app = new Application();
        this.app = app;

        await app.init({
            background: GAME_CONFIG.backgroundColor,
            antialias: true,
            width: container.clientWidth || GAME_CONFIG.minWidth,
            height: container.clientHeight || GAME_CONFIG.minHeight,
        });

        app.stop();

        if (this.destroyed) {
            this.abortMount(app);
            return;
        }

        this.canvas = app.canvas;

        if (this.canvas && this.container) {
            this.container.appendChild(this.canvas);
        }

        await this.assets.loadAll();

        if (this.destroyed) {
            this.abortMount(app);
            return;
        }

        this.input.mount();

        const scene = new MainScene(this.assets, this.input, this.sound);
        this.scene = scene;

        const width = container.clientWidth || GAME_CONFIG.minWidth;
        const height = container.clientHeight || GAME_CONFIG.minHeight;

        scene.init(width, height);
        app.stage.addChild(scene);

        if (app.ticker) {
            app.ticker.add(this.handleTick);
        }

        window.addEventListener('resize', this.handleResize);

        this.ready = true;
        this.mounted = true;

        app.start();
    }

    private handleTick = (ticker: { deltaMS: number }) => {
        if (this.destroyed || !this.ready || !this.scene) return;
        this.scene.update(ticker.deltaMS);
    };

    private handleResize = () => {
        if (this.resizeRaf !== null) {
            cancelAnimationFrame(this.resizeRaf);
        }

        this.resizeRaf = requestAnimationFrame(() => {
            if (!this.app || !this.scene || !this.container || this.destroyed) {
                this.resizeRaf = null;
                return;
            }

            const width = this.container.clientWidth || GAME_CONFIG.minWidth;
            const height = this.container.clientHeight || GAME_CONFIG.minHeight;

            this.app.renderer.resize(width, height);
            this.scene.resize(width, height);

            this.resizeRaf = null;
        });
    };

    destroy(): void {
        if (this.destroyed) return;
        this.destroyed = true;
        this.ready = false;

        window.removeEventListener('resize', this.handleResize);

        if (this.resizeRaf !== null) {
            cancelAnimationFrame(this.resizeRaf);
            this.resizeRaf = null;
        }

        const app = this.app;

        if (app?.ticker) {
            app.ticker.remove(this.handleTick);
            app.ticker.stop();
        }

        this.input.destroy();

        if (app && this.scene && this.scene.parent === app.stage) {
            app.stage.removeChild(this.scene);
        }

        if (this.scene) {
            this.scene.destroyScene();
            this.scene.destroy({ children: true });
            this.scene = null;
        }

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;

        if (app) {
            try {
                app.stage.removeChildren();
            } catch {}

            try {
                app.renderer.destroy();
            } catch {}
        }

        this.app = null;
        this.container = null;
        this.mounted = false;
    }

    private abortMount(app: Application): void {
        if (app?.ticker) {
            try {
                app.ticker.remove(this.handleTick);
            } catch {}
        }

        try {
            app.stop();
        } catch {}

        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;

        try {
            app.renderer.destroy();
        } catch {}

        this.app = null;
        this.scene = null;
        this.container = null;
        this.mounted = false;
        this.ready = false;
    }
}