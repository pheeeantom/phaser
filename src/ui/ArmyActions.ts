import { LandArmy } from "../country/LandArmy";
import { PlanetScene } from "../scenes/PlanetScene";
import { SpaceArmy } from "../country/SpaceArmy";
import { Army } from "../country/Army";

export class ArmyActions {
    menu: Phaser.GameObjects.Text;
    constructor() {

    }

    click(pixelX: number, pixelY: number, xArmy: number, yArmy: number, unitsLen: number) {
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
        let camera = (this.menu.scene as PlanetScene).camera.camera;
        let {x: pixelXNew, y: pixelYNew} = camera.getWorldPoint(pixelX, pixelY);
        let menuLeftX = this.menu.x;
        let menuTopY = this.menu.y;
        let menuRightX = this.menu.x + this.menu.width;;
        let height = 1 * this.menu.height / 2;
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
        this.menu?.destroy();
    }

    render(planetScene: PlanetScene, x: number, y: number) {
        this.clearMenu();
        let {x: pixelX, y: pixelY} = planetScene.toSceneCoordsPixels(x, y);
        if (pixelX && pixelY) {
            this.menu =
            planetScene.add.text(pixelX + 32, pixelY + 10, 'move one\nmove all',
            {color: '#000000', backgroundColor: '#555555'}).setDepth(400);
        }
    }
}