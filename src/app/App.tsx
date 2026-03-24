import { GameCanvas } from '../game/ui/GameCanvas';
import { HudOverlay} from "../game/ui/HudOverlay";

export default function App() {
    return (
        <>
            <GameCanvas />
            <HudOverlay />
        </>
    )
}