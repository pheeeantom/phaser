import { Scene } from "phaser";

export interface ContextMenu {
    click(pixelX: number, pixelY: number, camera: Phaser.Cameras.Scene2D.Camera): string;
    clear(): void;
    render(x: number, y: number, scene: Scene): void;
} 