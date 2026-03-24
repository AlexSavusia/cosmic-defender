export class InputController {
    private pressed = new Set<string>();
    private justPressed = new Set<string>();

    private onKeyDown = (e: KeyboardEvent) => {
        if (!this.pressed.has(e.code)) {
            this.justPressed.add(e.code);
        }
        this.pressed.add(e.code);
    };

    private onKeyUp = (e: KeyboardEvent) => {
        this.pressed.delete(e.code);
    };

    private onMouseUp = (e: MouseEvent) => {
        const code = `Mouse${e.button}`;
        this.pressed.delete(code);
    }

    private  onMouseDown = (e: MouseEvent) => {
        const code = `Mouse${e.button}`;
        if (!this.pressed.has(code)) {
            this.justPressed.add(code);
        }
        this.pressed.add(code);
    }

    mount(): void {
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        window.addEventListener('mouseup', this.onMouseUp);
        window.addEventListener('mousedown', this.onMouseDown);
    }

    destroy(): void {
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        window.removeEventListener('mouseup', this.onMouseUp);
        window.removeEventListener('mousedown', this.onMouseDown);
        this.pressed.clear();
        this.justPressed.clear();
    }

    isPressed(code: string): boolean {
        return this.pressed.has(code);
    }

    isJustPressed(code: string): boolean {
        return this.justPressed.has(code);
    }

    update(): void {
        this.justPressed.clear();
    }
}