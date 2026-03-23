import { Assets, Texture } from 'pixi.js';
import { assetManifest, type AssetKey } from '../assets/manifest';

export class AssetManager {
    private textures = new Map<AssetKey, Texture>();

    async loadAll(): Promise<void> {
        const entries = Object.entries(assetManifest) as Array<[AssetKey, string]>;

        for (const [key, path] of entries) {
            const texture = await Assets.load(path);
            this.textures.set(key, texture);
        }
    }

    getTexture(key: AssetKey): Texture {
        const texture = this.textures.get(key);

        if (!texture) {
            throw new Error(`Texture "${key}" is not loaded`);
        }

        return texture;
    }
}