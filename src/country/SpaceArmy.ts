import { Unit } from "~/unit/Unit";
import { Army } from "./Army";
import { Scene } from "phaser";

export class SpaceArmy extends Army {
    constructor() {
        super();
    }

    addUnit(target: Unit[], scene: Scene): Unit[] {
        this.addUnit0(target);
        return [];
    }

    removeUnit(target: Unit[], scene: Scene): Unit[] {
        this.removeUnit0(target);
        return [];
    }

    create(x: number, y: number) {
        this.create0(x, y);
    }
}