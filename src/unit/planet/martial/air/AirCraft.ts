import { AirAttacker } from "~/interfaces/AirAttacker";
import { PlanetUnit } from "../../PlanetUnit";

export class AirCraft extends PlanetUnit implements AirAttacker {
    static readonly cost: number = 20;
    airAttackDice: string;
    constructor() {
        super();
        this.movementPoints = 20;
        this.currentMovementPoints = this.movementPoints;
        this.name = "aircraft";
        this.meleeAttackDice = "1d2";
        this.airAttackDice = "3d12";
        this.maxNum = 3;
    }
}