import { useEffect, useRef } from 'react';
import { Game } from '../core/Game';

export function GameCanvas() {
    const rootRef = useRef<HTMLDivElement | null>(null);
    const gameRef = useRef<Game | null>(null);

    useEffect(() => {
        const element = rootRef.current;
        if (!element) return;

        const game = new Game();
        gameRef.current = game;

        void game.mount(element);

        return () => {
            gameRef.current?.destroy();
            gameRef.current = null;
        };
    }, []);

    return (
        <div
            ref={rootRef}
            style={{
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                background: '#000',
            }}
        />
    );
}