import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";
import { LAND, WATER, Shippable } from "../../../../interfaces/Marine";

export class Tank extends PlanetUnit implements Shippable {
    static readonly cost: number = 12;
    flag_shippable: boolean;
    constructor() {
        super();
        this.flag_shippable = false;
        this.landWater = LAND + WATER;
        this.movementPoints = 8;
        this.currentMovementPoints = this.movementPoints;
        this.name = "tank";
        this.meleeAttackDice = "2d12";
        this.maxNum = 5;
    }
}