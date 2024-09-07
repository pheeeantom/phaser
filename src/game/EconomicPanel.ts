import { Scene } from "phaser";
import { PlanetScene } from "~/scenes/PlanetScene";
import { Game } from "./Game";

export class EconomicPanel {
    private _mainMenu: Phaser.GameObjects.Text;
    private _info: Phaser.GameObjects.Text;
    constructor(scene: Scene) {
        this._mainMenu = scene.add.text(0, 0, /*"Build⯆"*/"End turn...", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        //this.mainMenu.setScrollFactor(0, 0);
    }

    click(x: number, y: number) {
        let menuLeftX = this._mainMenu.x;
        let menuTopY = this._mainMenu.y;
        let menuRightX = this._mainMenu.x + this._mainMenu.width;
        let menuBottomY = this._mainMenu.y + this._mainMenu.height;
        if (x > menuLeftX && x < menuRightX &&
            y > menuTopY && y < menuBottomY) {
            return "end turn";
        }
        return "none";
    }

    setInfo(scene: Scene) {
        this._mainMenu.destroy();
        this._mainMenu = scene.add.text(0, 0, /*"Build⯆"*/"End turn...", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._info = scene.add.text(0, 0,
            Game.getInstance().turn.getCurrentCountry().name + ", turn: " + String(Game.getInstance().turn.getCurrentTurn()),
            {backgroundColor: "#888888", color: Game.getInstance().turn.getCurrentCountry().color, fontSize: "20px"});
        this._mainMenu.setX(this._info.width);
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