import { AirAttacker } from "~/interfaces/AirAttacker";
import { PlanetUnit } from "../../PlanetUnit";
import { LAND, Shippable, WATER } from "../../../../interfaces/Marine";

export class AirCraft extends PlanetUnit implements AirAttacker, Shippable {
    static readonly cost: number = 20;
    airAttackDice: string;
    flag_shippable: boolean;
    constructor() {
        super();
        this.flag_shippable = false;
        this.landWater = LAND + WATER;
        this.movementPoints = 20;
        this.currentMovementPoints = this.movementPoints;
        this.name = "aircraft";
        this.meleeAttackDice = "1d2";
        this.airAttackDice = "3d12";
        this.maxNum = 3;
    }
}