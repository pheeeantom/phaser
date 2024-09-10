import { Profitable } from "../../interfaces/Profitable";
import { Locality } from "./Locality";

export class City extends Locality implements Profitable {
    static cost: number = 20;
    constructor() {
        super();
        this.terrainTypeId = 8;
    }

    income(): number {
        return 5;
    }
}