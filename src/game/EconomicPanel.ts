import { Scene } from "phaser";
import { PlanetScene } from "~/scenes/PlanetScene";

export class EconomicPanel {
    mainMenu: Phaser.GameObjects.Text;
    constructor(scene: Scene) {
        this.mainMenu = scene.add.text(0, 0, "Build⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this.mainMenu.setScrollFactor(0, 0);
    }

    /*render(scene: Scene) {
        this.mainMenu.destroy();
        let {x: newX, y: newY} = (scene as PlanetScene).camera.camera.getWorldPoint(0, 0);
        this.mainMenu = scene.add.text(newX, newY, "Build⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
    }*/

    /*update(scene: Scene) {
        this.mainMenu.destroy();
        this.mainMenu = scene.add.text(0, 0, "Build⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this.mainMenu.setScrollFactor(0, 0);
        this.mainMenu.scale = 1;
    }*/
}