import { Game } from "../game/Game";
import { Country } from "../country/Country";
import { PlanetScene } from "../scenes/PlanetScene";
import { Soldier } from "../unit/planet/martial/land/Soldier";
import { PlanetUnit } from "../unit/planet/PlanetUnit";
import { City } from "./improvement/City";
import { Village } from "./improvement/Village";
import { Tiles } from "./Tiles";

export class Planet {
    name: string;
    curUnit: PlanetUnit | null;
    tiles: Tiles;
    constructor(name) {
        this.name = name;
        this.tiles = new Tiles();
    }

    initTmp(planetScene: PlanetScene, game: Game) {
        game.countries = new Map();
        game.countries.set('russia', new Country('russia', [], []));
        game.countries.set('usa', new Country('usa', [], []));
        game.countries.set('china', new Country('china', [], []));
        let unit = new Soldier();
        unit.create(7, 3, planetScene);
        unit.movementRange();
        game.countries.get('russia')!.units.push(unit);
        this.curUnit = unit;
        new City().place(2, 3, 10000, planetScene);
        new City().place(4, 6, 10000, planetScene);
        new Village().place(7, 8, 1000, planetScene);
    }
}