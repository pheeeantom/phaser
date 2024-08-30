import { Country } from "~/country/Country";
import { Turn } from "./Turn";
import { Tile } from "~/planet/Tile";

export class Game {
    turn: Turn;
    private static instance: Game;
    constructor() {
        if (!Game.instance) {
            Game.instance = this;
            Game.instance.turn = new Turn(["russia", "usa", "china"]);
        }
        else {
            return Game.instance;
        }
    }

    static getInstance(): Game {
        return Game.instance;
    }
}