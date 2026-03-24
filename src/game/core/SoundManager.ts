import { Howl } from 'howler'

export class SoundManager {
    private sounds = {
        shoot: new Howl({
            src:'./sounds/shoot.mp3',
            volume: 0.4
        }),

        explosion: new Howl({
            src:'./sounds/explosion.mp3',
            volume: 0.5
        }),
    };

    playShoot(): void {
        this.sounds.shoot.play();
    }

    playExplosion(): void {
        this.sounds.explosion.play();
    }
}