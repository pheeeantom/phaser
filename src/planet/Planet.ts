import { Game } from "../game/Game";
import { Country } from "../country/Country";
import { PlanetScene } from "../scenes/PlanetScene";
import { Soldier } from "../unit/planet/martial/land/Soldier";
import { PlanetUnit } from "../unit/planet/PlanetUnit";
import { City } from "./improvement/City";
import { Village } from "./improvement/Village";
import { Tiles } from "./Tiles";
import { Unit } from "~/unit/Unit";
import { Tile } from "./Tile";
import { Army } from "~/country/Army";
import { LandArmy } from "../country/LandArmy";
import { SpaceArmy } from "~/country/SpaceArmy";

export class Planet {
    name: string;
    curArmy: LandArmy | null;
    tmpArmy: LandArmy | null;
    tiles: Tiles;
    activated: string;
    constructor(name) {
        this.name = name;
        this.tiles = new Tiles();
        this.activated = "none";
    }

    initTmp(planetScene: PlanetScene, game: Game) {
        new Country('russia', '#ff0000');
        new Country('usa', '#0000ff');
        new Country('china', '#00ff00');
        let unit1 = new Soldier();
        let unit2 = new Soldier();
        let russianArmy1 = new LandArmy();
        russianArmy1.create(7, 3);
        Country.getCountryByName('russia')!.addArmy(russianArmy1, [unit1, unit2], planetScene);
        //russianArmy1.movementRange();
        //this.curArmy = russianArmy1;
        let newyork = new City();
        newyork.place(2, 3, 10000, planetScene, 'newyork');
        newyork.occupy(Country.getCountryByName('usa')!, planetScene);
        let moscow = new City();
        moscow.place(4, 6, 10000, planetScene, 'moscow');
        moscow.occupy(Country.getCountryByName('russia')!, planetScene);
        let beijing = new Village();
        beijing.place(7, 8, 1000, planetScene, 'beijing');
        beijing.occupy(Country.getCountryByName('china')!, planetScene);
    }

    chooseCurUnit(x: number, y: number, planetScene: PlanetScene): void {
        if (!Country.getCurrentCountry()) {
            throw new Error('No current country');
        }
        else {
            this.curArmy = Planet.getArmyByXYAndCountry(x, y, Country.getCurrentCountry());
            this.curArmy?.movementRange();
            this.curArmy?.menu.render(planetScene, x, y);
        }
    }

    static getArmyByXYAndCountry(x: number, y: number, country: Country) {
        return country ? this.getArmy(x, y, country.armies) : null;
    }

    static getImprovementByXYAndCountry(x: number, y: number, country: Country) {
        return country ? this.getImprovement(x, y, country.tiles) : null;
    }

    static getArmyByXY(x: number, y: number) {
        let pile = Country.allArmies();
        return this.getArmy(x, y, pile);
    }

    static getImprovementByXY(x: number, y: number) {
        let pile = Country.allTiles();
        return this.getImprovement(x, y, pile);
    }

    static getArmy(x: number, y: number, pile: Army[]) {
        return pile.filter(
            (army) => army instanceof LandArmy
        ).find((army) => {
            return army.x === x && army.y === y;
        }) ?? null;
    }

    static getImprovement(x: number, y: number, pile: Tile[]) {
        let tile = pile.find((tile) => {
            return tile.x === x && tile.y === y;
        });
        return tile ? tile.improvement : null;
    }

    getTileByXY(x: number, y: number): Tile {
        return this.tiles.grid[x][y];
    }

    chooseOne(x: number, y: number) {
        //let singleUnitArmy = this.army instanceof LandArmy ? new LandArmy() : new SpaceArmy();
        let singleUnitArmy = new LandArmy();
        singleUnitArmy.create(x, y);
        //singleUnitArmy.addUnit([this.army.units[0]], this.menu.scene as PlanetScene);
        this.tmpArmy = singleUnitArmy;
    }

    cancelChooseOne() {
        this.tmpArmy = null;
    }

    chooseAll() {
        this.tmpArmy = null;
    }
}