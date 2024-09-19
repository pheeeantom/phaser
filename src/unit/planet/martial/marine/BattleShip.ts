import { WATER } from "../../../../interfaces/Marine";
import { PlanetUnit } from "../../PlanetUnit";

export class BattleShip extends PlanetUnit {
    static readonly cost: number = 15;
    constructor() {
        super();
        this.landWater = WATER;
        this.movementPoints = 8;
        this.currentMovementPoints = this.movementPoints;
        this.name = "battleship";
        this.meleeAttackDice = "3d20";
        this.maxNum = 3;
    }
}