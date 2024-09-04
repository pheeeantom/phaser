import { Country } from "../country/Country";
//import { Turn } from "./Turn";
import { Tile } from "~/planet/Tile";
import { Economic } from "./Economic";
import { PlanetScene } from "../scenes/PlanetScene";
import { LandArmy } from "../country/LandArmy";
import { Soldier } from "../unit/planet/martial/land/Soldier";

class Turn {
    num: number;
    country: string;
    countries: string[];
    constructor(countries: string[]) {
        this.countries = countries;
        this.country = countries[0];
        this.num = 0;
    }

    endTurn(planetScene: PlanetScene) {
        let index = this.countries.indexOf(this.country);
        if (index === this.countries.length - 1) {
            this.country = this.countries[0];
            this.num++;
        }
        else {
            this.country = this.countries[index + 1];
        }
        Country.getCountryByName(this.country)!.tiles.forEach(tile => {
            tile.tmpSpawnUnit(planetScene, Country.getCountryByName(this.country)!);
        });
    }

    getCurrentCountry() {
        let country = Country.getCountryByName(Game.getInstance().turn.country);
        if (!country) throw new Error('No current country');
        return country;
    }
}

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