import { LandArmy } from "../country/LandArmy";
import { PlanetScene } from "../scenes/PlanetScene";
import { SpaceArmy } from "../country/SpaceArmy";
import { Army } from "../country/Army";

export class ArmyActions {
    private _menu: Phaser.GameObjects.Text;
    constructor() {

    }

    click(pixelX: number, pixelY: number, unitsLen: number, planetScene: PlanetScene) {
        /*let {x: menuLeftX, y: menuTopY} = (this.menu.scene as PlanetScene).toSceneCoordsPixels(this.menu.x, this.menu.y);
        let {x: menuRightX, y: menuBottomY} = (this.menu.scene as PlanetScene).
            toSceneCoordsPixels(this.menu.x + this.menu.width, this.menu.y + 1 * this.menu.height / 1);*/
        /*let camera = (this.menu.scene as PlanetScene).camera.camera;
        let {x: menuLeftX, y: menuTopY} = camera.getWorldPoint(this.menu.x, this.menu.y);
        let {x: menuRightX, y: menuBottomY} = camera.getWorldPoint(this.menu.x + this.menu.width,
            this.menu.y + 1 * this.menu.height / 1);*/
        /*let menuLeftX = (-(this.menu.scene as PlanetScene).camera.camera.scrollX + this.menu.x) *
            (this.menu.scene as PlanetScene).camera.camera.zoom;
        let menuTopY = (-(this.menu.scene as PlanetScene).camera.camera.scrollY + this.menu.y) *
            (this.menu.scene as PlanetScene).camera.camera.zoom;
        let menuRightX = (-(this.menu.scene as PlanetScene).camera.camera.scrollX + this.menu.x + this.menu.width) *
            (this.menu.scene as PlanetScene).camera.camera.zoom;
        let menuBottomY = (-(this.menu.scene as PlanetScene).camera.camera.scrollY + this.menu.y + 1 * this.menu.height / 1) *
            (this.menu.scene as PlanetScene).camera.camera.zoom;*/
        /*let camera = (this.menu.scene as PlanetScene).camera.camera;
        let {x: pixelXNew, y: pixelYNew} = camera.getWorldPoint(pixelX, pixelY);
        let {x: menuLeftX, y: menuTopY} = camera.getWorldPoint(this.menu.x, this.menu.y);
        let {x: menuRightX, y: menuBottomY} = camera.getWorldPoint(this.menu.x + this.menu.width,
            this.menu.y + 1 * this.menu.height / 1);*/
        let camera = planetScene.camera.camera;
        let {x: pixelXNew, y: pixelYNew} = camera.getWorldPoint(pixelX, pixelY);
        let menuLeftX = this._menu.x;
        let menuTopY = this._menu.y;
        let menuRightX = this._menu.x + this._menu.width;;
        let height = 1 * this._menu.height / 2;
        this.clearMenu();
        if (pixelXNew > menuLeftX && pixelXNew < menuRightX &&
            pixelYNew > menuTopY && pixelYNew < menuTopY + height) {
            if (unitsLen > 1)
                return "move one";
            else
                return "move all";
        }
        else if (pixelXNew > menuLeftX && pixelXNew < menuRightX &&
            pixelYNew > menuTopY + height && pixelYNew < menuTopY + 2 * height) {
            return "move all";
        }
        else {
            return "none";
        }
        /*console.log(camera.width);
        console.log(menuLeftX);
        console.log(this.menu.x);
        console.log(pixelXNew);*/
    }

    clearMenu() {
        this._menu?.destroy();
    }

    render(planetScene: PlanetScene, x: number, y: number) {
        this.clearMenu();
        let {x: pixelX, y: pixelY} = planetScene.toSceneCoordsPixels(x, y);
        if (pixelX !== null && pixelY !== null) {
            this._menu =
            planetScene.add.text(pixelX + 32, pixelY + 10, 'move one\nmove all',
            {color: '#000000', backgroundColor: '#555555'}).setDepth(400);
        }
    }
}