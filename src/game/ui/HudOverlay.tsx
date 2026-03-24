import {useGameStore} from "../store/gameStore";

export function HudOverlay() {
    const score = useGameStore((state) => state.score);

    return (
        <div style={{ position: "fixed", inset: 0, pointerEvents: 'none', zIndex: 10, }}>
            <div style={{ position: "absolute", top: 16, left: 16, padding: '10px 14px', borderRadius: 12, background: 'rgba(0, 0, 0, 0.45)', color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5, userSelect: 'none' }}>
                Score: {score}
            </div>
        </div>
    );
}