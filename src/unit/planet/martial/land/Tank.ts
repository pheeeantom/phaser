import { PlanetScene } from "~/scenes/PlanetScene";
import { PlanetUnit } from "../../PlanetUnit";

export class Tank extends PlanetUnit {
    static readonly cost: number = 12;
    constructor() {
        super();
        this.movementPoints = 8;
        this.currentMovementPoints = this.movementPoints;
        this.name = "tank";
        this.meleeAttackDice = "2d12";
        this.maxNum = 5;
    }
}