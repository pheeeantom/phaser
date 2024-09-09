import { Profitable } from "~/interfaces/Profitable";
import { Locality } from "./Locality";

export class Village extends Locality implements Profitable {
    static cost: number = 5;
    constructor() {
        super();
        this.terrainTypeId = 9;
    }

    income(): number {
        return 1;
    }
}