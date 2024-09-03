import { Unit } from "~/unit/Unit";
import { Army } from "./Army";
import { Scene } from "phaser";

export class SpaceArmy extends Army {
    constructor() {
        super();
    }

    override addUnits(target: Unit[], scene: Scene, color: string): Unit[] {
        super.addUnits(target);
        return target;
    }

    override removeUnits(target: Unit[], scene: Scene, color: string): Unit[] {
        super.removeUnits(target);
        return target;
    }

    override create(x: number, y: number) {
        super.create(x, y);
    }

    meleeAttack(army: Army) {

    }

    transferOneFromArmy(army: Army, scene: Scene, color: string) {

    }

    addAllFromArmy(army: Army, scene: Scene, color: string) {

    }
}