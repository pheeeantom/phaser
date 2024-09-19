import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";
import { LAND, Shippable, WATER } from "../../../../interfaces/Marine";

export class Soldier extends PlanetUnit implements Shippable {
    static readonly cost: number = 5;
    flag_shippable: boolean;
    constructor() {
        super();
        this.flag_shippable = false;
        this.landWater = LAND + WATER;
        this.movementPoints = 5;
        this.currentMovementPoints = this.movementPoints;
        this.name = "soldier";
        this.meleeAttackDice = "1d6";
        this.maxNum = 8;
    }
}