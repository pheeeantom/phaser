import { Scene } from "phaser";

export class EconomicPanel {
    mainMenu: Phaser.GameObjects.Text;
    constructor(scene: Scene) {
        this.mainMenu = scene.add.text(0, 0, "Build⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
    }
}