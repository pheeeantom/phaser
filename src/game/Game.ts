import { Country } from "../country/Country";
//import { Turn } from "./Turn";
import { Tile } from "~/planet/Tile";
import { Economic } from "./Economic";
import { PlanetScene } from "../scenes/PlanetScene";
import { LandArmy } from "../country/LandArmy";
import { Soldier } from "../unit/planet/martial/land/Soldier";
import { PlayScene } from "~/scenes/PlayScene";
import { Scene } from "phaser";

class Turn {
    num: number;
    country: string;
    countries: string[];
    constructor(countries: string[]) {
        this.countries = countries;
        this.country = countries[0];
        this.num = 0;
    }

    endTurn(planetScene: PlanetScene, playScene: PlayScene) {
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
        Country.getCountryByName(this.country)!.restoreCurrentMovementPoints();
        Game.getInstance().economic.mainPanel.setInfo(playScene);
    }

    getCurrentCountry() {
        let country = Country.getCountryByName(Game.getInstance().turn.country);
        if (!country) throw new Error('No current country');
        return country;
    }

    removeCountry(name: string) {
        this.countries = this.countries.filter(country => country !== name);
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

    loseCountry(country: Country, scene: Scene): void {
        console.log(country);
        for (let i = 0; i < country.armies.length; i++) {
            Country.removeArmy(country.armies[i]);
            i--;
        }
        this.turn.removeCountry(country.name);
        Country.removeCountry(country);
        if ([...Country.allCountries().values()].length === 1) {
            scene.game.scene.scenes.forEach((scene) => {
                const key = scene.scene.key; // This is not a typo, the scene here is more like a "game" object, so the scene actually is under the "scene" property.
                scene.game.scene.stop(key);
            })
            scene.game.scene.start("win", {
                'text': '🥳' + [...Country.allCountries().values()][0].name + ' wins🥳',
                'color': [...Country.allCountries().values()][0].color
            });
        }
    }
}