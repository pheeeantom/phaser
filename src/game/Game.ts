import { Country } from "~/country/Country";
import { Turn } from "./Turn";
import { Tile } from "~/planet/Tile";
import { Economic } from "./Economic";

export class Game {
    turn: Turn;
    economic: Economic;
    private static instance: Game;
    constructor(economic: Economic) {
        if (!Game.instance) {
            Game.instance = this;
            Game.instance.turn = new Turn(["russia", "usa", "china"]);
            Game.instance.economic = economic;
        }
        else {
            return Game.instance;
        }
    }

    static getInstance(): Game {
        return Game.instance;
    }
}