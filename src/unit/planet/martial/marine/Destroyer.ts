import { RangedAttacker } from "~/interfaces/RangedAttacker";
import { WATER } from "../../../../interfaces/Marine";
import { PlanetUnit } from "../../PlanetUnit";

export class Destroyer extends PlanetUnit implements RangedAttacker {
    static readonly cost: number = 15;
    range: number;
    rangedAttackDice: string;
    constructor() {
        super();
        this.landWater = WATER;
        this.movementPoints = 8;
        this.currentMovementPoints = this.movementPoints;
        this.name = "destroyer";
        this.meleeAttackDice = "1d12";
        this.maxNum = 3;
        this.range = 3;
        this.rangedAttackDice = "2d12";
    }
}