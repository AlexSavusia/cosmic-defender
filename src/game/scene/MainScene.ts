import { Container } from 'pixi.js';
import { Player } from '../entities/Player';
import { Bullet } from '../entities/Bullet';
import { Enemy } from '../entities/Enemy';
import { Explosion } from '../entities/Explosion';
import { AssetManager } from '../core/AssetsManager';
import { InputController } from '../core/InputController';
import { GAME_CONFIG } from '../../shared/config/gameConfig';
import { ASSET_KEYS } from '../assets/manifest';
import { useGameStore } from '../store/gameStore';
import {SoundManager} from "../core/SoundManager";
import  { Pool} from "../core/Pool";

export class MainScene extends Container {
    private bulletPool = new Pool(() => new Bullet(0, 0));
    private explosionPool = new Pool(() => new Explosion(0, 0));
    private readonly sound: SoundManager;
    private readonly assets: AssetManager;
    private readonly input: InputController;

    private player!: Player;
    private bullets: Bullet[] = [];
    private enemies: Enemy[] = [];
    private explosions: Explosion[] = [];

    private widthViewport = 0;
    private heightViewport = 0;

    private lastFireAt = 0;
    private lastSpawnAt = 0;

    constructor(assets: AssetManager, input: InputController, sound: SoundManager) {
        super();

        this.assets = assets;
        this.input = input;
        this.sound = sound;
    }

    init(width: number, height: number): void {
        this.widthViewport = width;
        this.heightViewport = height;

        useGameStore.getState().resetScore();

        this.player = new Player(this.assets.getTexture(ASSET_KEYS.player));
        this.player.x = width / 2;
        this.player.y = height - 80;

        this.addChild(this.player);
    }

    resize(width: number, height: number): void {
        this.widthViewport = width;
        this.heightViewport = height;

        if (this.player) {
            this.player.y = height - 80;
            this.player.x = Math.min(Math.max(this.player.x, 40), width - 40);
        }
    }

    update(deltaMs: number): void {
        if (this.input.isJustPressed('Escape')) {
            const store = useGameStore.getState();
            store.setPaused(!store.isPaused);
        }
        this.input.update();

        const isPaused = useGameStore.getState().isPaused;
        if (isPaused) return;

        this.handlePlayerInput();
        this.handleFire();
        this.handleEnemySpawn(deltaMs);
        this.updateBullets();
        this.updateEnemies();
        this.updateExplosions(deltaMs);
        this.handleCollisions();
        this.cleanup();
    }

    private handlePlayerInput(): void {
        if (this.input.isPressed('ArrowLeft') || this.input.isPressed('KeyA')) {
            this.player.moveLeft(32);
        }

        if (this.input.isPressed('ArrowRight') || this.input.isPressed('KeyD')) {
            this.player.moveRight(this.widthViewport - 32);
        }
    }

    private handleFire(): void {
        const now = performance.now();
        const wantsShoot =
            this.input.isPressed('Space') || this.input.isPressed('ArrowUp') || this.input.isPressed('Mouse0');

        if (!wantsShoot) return;
        if (now - this.lastFireAt < GAME_CONFIG.fireCooldownMs) return;

        this.lastFireAt = now;

        const bullet = this.bulletPool.get();
        bullet.reset(this.player.x, this.player.y - 30);
        this.bullets.push(bullet);
        this.addChild(bullet);
        this.sound.playShoot()
    }

    private handleEnemySpawn(deltaMs: number): void {
        this.lastSpawnAt += deltaMs;

        if (this.lastSpawnAt < 800) return;

        this.lastSpawnAt = 0;

        const enemy = new Enemy(
            this.assets.getTexture(ASSET_KEYS.enemyShip),
            50 + Math.random() * (this.widthViewport - 100),
            -50,
        );

        this.enemies.push(enemy);
        this.addChild(enemy);
    }

    private updateBullets(): void {
        for (const bullet of this.bullets) {
            bullet.update();
        }
    }

    private updateEnemies(): void {
        for (const enemy of this.enemies) {
            enemy.update(this.heightViewport);
        }
    }

    private updateExplosions(deltaMs: number): void {
        for (const explosion of this.explosions) {
            explosion.update(deltaMs);
        }
    }

    private handleCollisions(): void {
        for (const bullet of this.bullets) {
            for (const enemy of this.enemies) {
                if (!bullet.isAlive || !enemy.isAlive) continue;

                const dx = bullet.x - enemy.x;
                const dy = bullet.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < enemy.hitRadius) {
                    bullet.isAlive = false;
                    enemy.isAlive = false;
                    this.spawnExplosion(enemy.x, enemy.y);
                    this.sound.playExplosion();
                    useGameStore.getState().addScore(100);
                }
            }
        }
    }

    private spawnExplosion(x: number, y: number): void {
        const explosion = this.explosionPool.get();
        explosion.reset(x, y);
        this.explosions.push(explosion);
        this.addChild(explosion);
    }

    private cleanup(): void {
        this.bullets = this.bullets.filter((bullet) => {
            if (!bullet.isAlive) {
                this.removeChild(bullet);
                this.bulletPool.release(bullet);
                return false;
            }

            return true;
        });

        this.enemies = this.enemies.filter((enemy) => {
            if (!enemy.isAlive) {
                this.removeChild(enemy);
                enemy.destroy();
                return false;
            }

            return true;
        });

        this.explosions = this.explosions.filter((explosion) => {
            if (!explosion.isAlive) {
                this.removeChild(explosion);
                this.explosionPool.release(explosion);
                return false;
            }

            return true;
        });
    }

    destroyScene(): void {
        for (const bullet of this.bullets) {
            bullet.destroy();
        }

        for (const enemy of this.enemies) {
            enemy.destroy();
        }

        for (const explosion of this.explosions) {
            explosion.destroy({ children: true });
        }

        this.player?.destroy();

        this.bullets = [];
        this.enemies = [];
        this.explosions = [];

        this.removeChildren();
    }
}