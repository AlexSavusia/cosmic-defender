export const ASSET_KEYS = {
    player: 'player',
    bomb: 'bomb',
    enemyShip: 'enemyShip',
} as const;

export type AssetKey = (typeof ASSET_KEYS)[keyof typeof ASSET_KEYS];

export const assetManifest: Record<AssetKey, string> = {
    player: '/assets/sprites/player.png',
    bomb: '/assets/sprites/bomb.png',
    enemyShip: '/assets/sprites/enemy/shipBlue.png',
};