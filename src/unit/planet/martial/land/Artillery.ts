import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";
import { RangedAttacker } from "../../../../interfaces/RangedAttacker";
import { LAND, Shippable, WATER } from "../../../../interfaces/Marine";

export class Artillery extends PlanetUnit implements RangedAttacker, Shippable {
    static readonly cost: number = 7;
    range: number;
    rangedAttackDice: string;
    flag_shippable: boolean;
    constructor() {
        super();
        this.flag_shippable = false;
        this.landWater = LAND + WATER;
        this.movementPoints = 2;
        this.currentMovementPoints = this.movementPoints;
        this.name = "artillery";
        this.meleeAttackDice = "1d2";
        this.maxNum = 5;
        this.range = 5;
        this.rangedAttackDice = "1d6";
    }
}