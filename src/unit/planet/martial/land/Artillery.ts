import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";
import { RangedAttacker } from "../../../../interfaces/RangedAttacker";

export class Artillery extends PlanetUnit implements RangedAttacker {
    static readonly cost: number = 7;
    range: number;
    rangedAttackDice: string;
    constructor() {
        super();
        this.movementPoints = 2;
        this.currentMovementPoints = this.movementPoints;
        this.name = "artillery";
        this.meleeAttackDice = "1d2";
        this.maxNum = 5;
        this.range = 5;
        this.rangedAttackDice = "1d6";
    }
}