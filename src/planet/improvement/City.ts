import { Profitable } from "../../interfaces/Profitable";
import { Locality } from "./Locality";

export class City extends Locality implements Profitable {
    static cost: number = 50;
    constructor() {
        super();
        this.terrainTypeId = 8;
    }

    income(): number {
        return 15;
    }
}