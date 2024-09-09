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
    private _num: number;
    private _country: string;
    private _countries: string[];
    constructor(countries: string[]) {
        this._countries = countries;
        this._country = countries[0];
        this._num = 0;
    }

    getCurrentTurn() {
        return this._num + 1;
    }

    endTurn(planetScene: PlanetScene, playScene: PlayScene) {
        let index = this._countries.indexOf(this._country);
        if (index === this._countries.length - 1) {
            this._country = this._countries[0];
            this._num++;
        }
        else {
            this._country = this._countries[index + 1];
        }
        Country.getCountryByName(this._country)!.tmpSpawnUnitAll(planetScene);
        Country.getCountryByName(this._country)!.restoreCurrentMovementPoints();
        Game.getInstance().economic.mainPanel.setInfo(playScene);
    }

    getCurrentCountry() {
        let country = Country.getCountryByName(Game.getInstance().turn._country);
        if (!country) throw new Error('No current country');
        return country;
    }

    removeCountry(name: string) {
        this._countries = this._countries.filter(country => country !== name);
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
        country.removeAllArmies();
        /*for (let i = 0; i < country.armies.length; i++) {
            country.armies[i].remove();
            i--;
        }*/
        this.turn.removeCountry(country.name);
        Country.removeCountry(country);
        country.giveAllTilesToAnotherCountry(Game.getInstance().turn.getCurrentCountry(), scene);
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