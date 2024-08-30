import { LandArmy } from "../country/LandArmy";
import { PlanetScene } from "../scenes/PlanetScene";
import { SpaceArmy } from "../country/SpaceArmy";
import { Army } from "../country/Army";

export class ArmyActions {
    army: Army;
    tmpArmy: Army | null;
    menu: Phaser.GameObjects.Text;
    activated: boolean;
    constructor(army: Army) {
        this.army = army;
        this.tmpArmy = null;
    }

    click(pixelX: number, pixelY: number) {
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
            pixelYNew > menuTopY && pixelYNew < menuTopY + height &&
            this.army.units.length > 1) {
            console.log("move one");
            this.chooseOne();
        }
        else if (pixelXNew > menuLeftX && pixelXNew < menuRightX &&
            pixelYNew > menuTopY + height && pixelYNew < menuTopY + 2 * height) {
            console.log("move all");
            this.chooseAll();
        }
        else {
            console.log("none");
        }
        /*console.log(camera.width);
        console.log(menuLeftX);
        console.log(this.menu.x);
        console.log(pixelXNew);*/
    }

    private chooseOne() {
        //let singleUnitArmy = this.army instanceof LandArmy ? new LandArmy() : new SpaceArmy();
        let singleUnitArmy = new SpaceArmy();
        singleUnitArmy.create0(this.army.x, this.army.y);
        //singleUnitArmy.addUnit([this.army.units[0]], this.menu.scene as PlanetScene);
        this.tmpArmy = singleUnitArmy;
        this.activated = true;
    }

    private cancelChooseOne() {
        this.tmpArmy = null;
    }

    private chooseAll() {
        this.tmpArmy = null;
        this.activated = true;
    }

    clearMenu() {
        this.menu?.destroy();
        this.activated = false;
    }

    render(planetScene: PlanetScene) {
        this.clearMenu();
        let {x: pixelX, y: pixelY} = planetScene.toSceneCoordsPixels(this.army.x, this.army.y);
        if (pixelX && pixelY) {
            this.menu =
            planetScene.add.text(pixelX + 32, pixelY + 10, 'move one\nmove all',
            {color: '#000000', backgroundColor: '#555555'}).setDepth(400);
        }
    }
}