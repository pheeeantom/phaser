import { Unit } from "~/unit/Unit";
import { Scene } from "phaser";
import { PlanetScene } from "~/scenes/PlanetScene";
import { Country } from "./Country";
import { Createable } from "../interfaces/Createable";
import { ContextMenu } from"../interfaces/ContextMenu";
import { Tile } from "~/planet/Tile";
import { isRangedAttacker } from "../interfaces/RangedAttacker";
import { isAirAttacker } from "../interfaces/AirAttacker";
import { isShippable, Shippable } from "../interfaces/Marine";

class ArmyActions implements ContextMenu {
    private _menu: Phaser.GameObjects.Text;
    private _army: Army;
    constructor(army: Army) {
        this._army = army;
    }

    click(pixelX: number, pixelY: number, camera: Phaser.Cameras.Scene2D.Camera) {
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
        //let camera = planetScene.camera.camera;
        let {x: pixelXNew, y: pixelYNew} = camera.getWorldPoint(pixelX, pixelY);
        let menuLeftX = this._menu.x;
        let menuTopY = this._menu.y;
        let menuRightX = this._menu.x + this._menu.width;;
        let height = 1 * this._menu.height / this._menu.text.split('\n').length;

        let unitsLen = this._army.getUnitsNumber();
        this.clear();
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
            if (isRangedAttacker(this._army.getFirstUnit()) && pixelXNew > menuLeftX && pixelXNew < menuRightX &&
                pixelYNew > menuTopY + 2 * height && pixelYNew < menuTopY + 3 * height) {
                console.log("shoooot");
                return "shoot";
            }
            if (isAirAttacker(this._army.getFirstUnit()) && pixelXNew > menuLeftX && pixelXNew < menuRightX &&
                pixelYNew > menuTopY + 2 * height && pixelYNew < menuTopY + 3 * height) {
                console.log("air attaaaaack");
                return "air attack";
            }
            return "none";
        }
        /*console.log(camera.width);
        console.log(menuLeftX);
        console.log(this.menu.x);
        console.log(pixelXNew);*/
    }

    clear() {
        this._menu?.destroy();
    }

    render(x: number, y: number, scene: Scene) {
        this.clear();
        //let {x: pixelX, y: pixelY} = planetScene.toSceneCoordsPixels(x, y);
        //if (pixelX !== null && pixelY !== null) {
        //console.log(this._army, isRangedAttacker(this._army));
        this._menu =
            scene.add.text(x*64 + 32, y*64 + 10, 'move one\nmove all' + (isRangedAttacker(this._army.getFirstUnit()) ? '\nshoot' :
            (isAirAttacker(this._army.getFirstUnit()) ? '\nair attack' : '')),
            {color: '#000000', backgroundColor: '#555555'}).setDepth(400);
        //}
    }
}

export abstract class Army implements Createable<Army> {
    protected _units: Unit[];
    protected _x: number;
    protected _y: number;
    protected _sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    protected _label: Phaser.GameObjects.Text;
    menu: ArmyActions;
    constructor() {
        
    }

    remove(): void {
        console.log(this);
        this.clearIcon();
        this.clearLabel();
        Country.removeArmy(this);
        //Country.getCountryByArmy(this)!.armies.splice(Country.getCountryByArmy(this)!.armies.indexOf(this), 1);
    }

    protected addUnits(target: Unit[], scene?: Scene, color?: string): void {
        this._units.push(...target);
        //this.updateMovementPoints();
        console.log(this);
        //return target;
        /*if (this instanceof LandArmy) {
            let country = Country.getCountryByArmy(this);
            console.log(country);
            if (!country) throw new Error('Army is not in any country');
            this.renderLabel(scene as PlanetScene, country.color);
        }
        return target;*/
    }

    protected removeUnits(target: Unit[], scene?: Scene, color?: string): void {
        this._units = this._units.filter((unit) => !target.includes(unit));
        //this.updateMovementPoints();
        console.log(this);
        /*if (this instanceof LandArmy) {
            let country = Country.getCountryByArmy(this);
            console.log(country);
            if (!country) throw new Error('Army is not in any country');
            this.renderLabel(scene as PlanetScene, country.color);
        }
        return target;*/
    }

    protected clearUnits(): void {
        this._units = [];
    }

    /*isContainsUnit(target: Unit): boolean {
        return this._units.indexOf(target) >= 0;
    }*/

    create(x: number, y: number, place?: unknown): this {
        this._units = [];
        this._x = x;
        this._y = y;
        this.menu = new ArmyActions(this);
        return this;
    }

    getUnitsType() {
        return this._units.length ? this._units[0].name : '';
    }

    getUnitsNumber() {
        return this._units.length;
    }

    protected renderIcon(scene: Scene) {
        let spriteName;
        if (isShippable(this.getFirstUnit())) {
            spriteName = (this.getFirstUnit() as unknown as Shippable).flag_shippable ? 'ship' : this.getUnitsType();
        }
        else {
            spriteName = this.getUnitsType();
        }
        this.clearIcon();
        this._sprite = scene.physics.add.sprite(64*this._x, 64*this._y, spriteName).setOrigin(0, 0).setDepth(200);
    }

    protected clearIcon() {
        this._sprite?.destroy();
    }

    protected renderLabel(scene: Scene, color: string) {
        this.clearLabel();
        //let {x: pixelX, y: pixelY} = camera.getWorldPoint(this.x*64, this.y*64);
        //if (pixelX !== null && pixelY !== null) {
        console.log(String(this._units.length));
        this._label =
            scene.add.text(this._x*64 + 54, this._y*64 + 50, String(this._units.length),
            {color: color, backgroundColor: '#ffffff'}).setDepth(300);
        //}
    }

    protected clearLabel() {
        this._label?.destroy();
    }

    abstract meleeAttack(army: Army): void;

    abstract transferOneFromArmy(army: Army, scene: Scene, color: string): void;

    abstract addAllFromArmy(army: Army, scene: Scene, color: string): void;

    abstract pickOne(scene: Scene): Army;

    getFirstUnit() {
        return this._units[0];
    }
}