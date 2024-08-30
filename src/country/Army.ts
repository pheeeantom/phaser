import { PlanetScene } from "~/scenes/PlanetScene";
import { Unit } from "~/unit/Unit";
import { LandArmy } from "./LandArmy";
import { Country } from "./Country";
import { Scene } from "phaser";
import { ArmyActions } from "../ui/ArmyActions";

export class Army {
    units: Unit[];
    x: number;
    y: number;
    range: Phaser.GameObjects.Rectangle[];
    movementPoints: number;
    label: Phaser.GameObjects.Text;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    menu: ArmyActions;
    constructor() {
        this.range = [];
    }

    addUnit(target: Unit[], scene: Scene): Unit[] {
        this.units.push(...target);
        this.updateMovementPoints();
        console.log(this);
        if (this instanceof LandArmy) {
            let country = Country.getCountryByArmy(this);
            console.log(country);
            if (!country) throw new Error('Army is not in any country');
            this.renderLabel(scene as PlanetScene, country.color);
        }
        return target;
    }

    removeUnit(target: Unit[], scene: Scene): Unit[] {
        this.units = this.units.filter((unit) => !target.includes(unit));
        this.updateMovementPoints();
        console.log(this);
        if (this instanceof LandArmy) {
            let country = Country.getCountryByArmy(this);
            console.log(country);
            if (!country) throw new Error('Army is not in any country');
            this.renderLabel(scene as PlanetScene, country.color);
        }
        return target;
    }

    isContainsUnit(target: Unit): boolean {
        return this.units.indexOf(target) >= 0;
    }

    updateMovementPoints() {
        this.movementPoints = Math.min(...this.units.map(unit => unit.movementPoints));
    }

    create0(x: number, y: number) {
        this.units = [];
        this.x = x;
        this.y = y;
        this.menu = new ArmyActions(this);
    }
}