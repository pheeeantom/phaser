import { Profitable } from "../../interfaces/Profitable";
import { Locality } from "./Locality";

export class Town extends Locality implements Profitable {
    static cost: number = 20;
    constructor() {
        super();
        this.terrainTypeId = 10;
    }

    income(): number {
        return 5;
    }
}