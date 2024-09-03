import { Unit } from "~/unit/Unit";
import { ArmyActions } from "../ui/ArmyActions";
import { Scene } from "phaser";
import { PlanetScene } from "~/scenes/PlanetScene";

export abstract class Army {
    protected _units: Unit[];
    x: number;
    y: number;
    protected _sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    protected _label: Phaser.GameObjects.Text;
    menu: ArmyActions;
    constructor() {

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

    isContainsUnit(target: Unit): boolean {
        return this._units.indexOf(target) >= 0;
    }

    protected create(x: number, y: number) {
        this._units = [];
        this.x = x;
        this.y = y;
        this.menu = new ArmyActions();
    }

    getUnitsType() {
        return this._units[0].name;
    }

    getUnitsNumber() {
        return this._units.length;
    }

    renderIcon(scene: Scene) {
        this.clearIcon();
        this._sprite = scene.physics.add.sprite(64*this.x, 64*this.y, this.getUnitsType()).setOrigin(0, 0).setDepth(200);
    }

    clearIcon() {
        this._sprite?.destroy();
    }

    clearLabel() {
        this._label?.destroy();
    }

    renderLabel(planetScene: PlanetScene, color: string) {
        this.clearLabel();
        let {x: pixelX, y: pixelY} = planetScene.toSceneCoordsPixels(this.x, this.y);
        if (pixelX !== null && pixelY !== null) {
        console.log(String(this._units.length));
          this._label =
            planetScene.add.text(pixelX + 54, pixelY + 50, String(this._units.length),
            {color: color, backgroundColor: '#ffffff'}).setDepth(300);
        }
    }

    abstract meleeAttack(army: Army): void;

    abstract transferOneFromArmy(army: Army, scene: Scene, color: string): void;

    abstract addAllFromArmy(army: Army, scene: Scene, color: string): void;
}