import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";
import { RangedAttacker } from "../../../../interfaces/RangedAttacker";

export class Artillery extends PlanetUnit implements RangedAttacker {
    static cost: number = 10;
    range: number;
    rangedAttackDice: string;
    constructor() {
        super();
        this.movementPoints = 2;
        this.currentMovementPoints = this.movementPoints;
        this.name = "artillery";
        this.meleeAttackDice = "1d2";
        this.maxNum = 3;
        this.range = 2;
        this.rangedAttackDice = "1d6";
    }
}