import { Application } from 'pixi.js';
import { GAME_CONFIG } from '../../shared/config/gameConfig';
import { AssetManager } from './AssetsManager';
import { InputController } from './InputController';
import { MainScene } from '../scene/MainScene';

export class Game {
    private app: Application | null = null;
    private container: HTMLElement | null = null;
    private canvas: HTMLCanvasElement | null = null;

    private readonly assets = new AssetManager();
    private readonly input = new InputController();
    private scene: MainScene | null = null;

    private destroyed = false;
    private mounted = false;
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

        if (this.destroyed) {
            this.safeDisposeApp(app);
            this.app = null;
            return;
        }

        this.canvas = app.canvas;
        container.appendChild(app.canvas);

        await this.assets.loadAll();

        if (this.destroyed) {
            this.safeDisposeApp(app);
            this.app = null;
            return;
        }

        this.input.mount();

        const scene = new MainScene(this.assets, this.input);
        this.scene = scene;

        scene.init(container.clientWidth || GAME_CONFIG.minWidth, container.clientHeight || GAME_CONFIG.minHeight);

        app.stage.addChild(scene);
        app.ticker.add(this.handleTick);

        window.addEventListener('resize', this.handleResize);

        this.mounted = true;
    }

    private handleTick = (ticker: { deltaMS: number }) => {
        this.scene?.update(ticker.deltaMS);
    };

    private handleResize = () => {
        if (this.resizeRaf !== null) {
            cancelAnimationFrame(this.resizeRaf);
        }

        this.resizeRaf = requestAnimationFrame(() => {
            if (!this.container || !this.scene || !this.app) return;

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

        window.removeEventListener('resize', this.handleResize);

        if (this.resizeRaf !== null) {
            cancelAnimationFrame(this.resizeRaf);
            this.resizeRaf = null;
        }

        if (this.app?.ticker) {
            this.app.ticker.remove(this.handleTick);
            this.app.ticker.stop();
        }

        if (this.scene) {
            if (this.app?.stage && this.scene.parent === this.app.stage) {
                this.app.stage.removeChild(this.scene);
            }

            this.scene.destroyScene();
            this.scene.destroy({ children: true });
            this.scene = null;
        }

        this.input.destroy();

        if (this.app) {
            this.safeDisposeApp(this.app);
            this.app = null;
        }

        this.canvas = null;
        this.container = null;
        this.mounted = false;
    }

    private safeDisposeApp(app: Application): void {
        try {
            if (app.stage) {
                app.stage.removeChildren();
                app.stage.destroy({ children: true });
            }
        } catch (error) {
            console.warn('Pixi stage destroy error:', error);
        }

        try {
            if (app.renderer) {
                app.renderer.destroy();
            }
        } catch (error) {
            console.warn('Pixi renderer destroy error:', error);
        }

        try {
            const canvas = this.canvas ?? app.canvas;
            if (canvas?.parentNode) {
                canvas.parentNode.removeChild(canvas);
            }
        } catch (error) {
            console.warn('Canvas detach error:', error);
        }
    }
}