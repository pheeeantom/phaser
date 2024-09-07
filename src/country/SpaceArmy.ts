import { Unit } from "~/unit/Unit";
import { Army } from "./Army";
import { Scene } from "phaser";
import { Space } from "~/space/Space";
import { CreateableSpace } from "~/interfaces/Createable";
import { Tile } from "~/planet/Tile";

export class SpaceArmy extends Army implements CreateableSpace<SpaceArmy> {
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

    override create(x: number, y: number, space: Space) {
        super.create(x, y);
        return this;
    }

    meleeAttack(army: Army) {

    }

    transferOneFromArmy(army: Army, scene: Scene, color: string) {

    }

    addAllFromArmy(army: Army, scene: Scene, color: string) {

    }

    pickOne(scene: Scene): SpaceArmy {
        return new SpaceArmy();
    }
}