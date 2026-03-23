export class InputController {
    private pressedKeys = new Set<string>();

    private handleKeyDown = (event: KeyboardEvent) => {
        this.pressedKeys.add(event.code);
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        this.pressedKeys.delete(event.code);
    };

    mount(): void {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }

    destroy(): void {
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        this.pressedKeys.clear();
    }

    isPressed(code: string): boolean {
        return this.pressedKeys.has(code);
    }
}