import { Country } from "~/country/Country";
import { Turn } from "./Turn";

export class Game {
    turn: Turn;
    countries: Map<string, Country>;
    constructor() {
        this.turn = new Turn(["russia", "usa", "china"]);
    }
}