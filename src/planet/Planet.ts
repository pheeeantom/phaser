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
        let unit3 = new Soldier();
        let unit4 = new Soldier();
        let unit5 = new Soldier();
        let unit6 = new Soldier();
        let unit7 = new Soldier();
        let unit8 = new Soldier();

        let unit9 = new Soldier();
        let unit10 = new Soldier();
        let unit11 = new Soldier();
        //console.log(unit1.diceRoll('10d12'));
        let russianArmy1 = new LandArmy();
        let chinaArmy2 = new LandArmy();
        let russianArmy3 = new LandArmy();
        russianArmy1.create(7, 3);
        chinaArmy2.create(7, 4);
        russianArmy3.create(6, 3);
        (Country.getCountryByName('russia')!.addArmy(russianArmy1, planetScene) as LandArmy).addUnits([unit1, unit2, unit3, unit4, unit5, unit9, unit10], planetScene, Country.getCountryByName('russia')!.color);
        (Country.getCountryByName('china')!.addArmy(chinaArmy2, planetScene) as LandArmy).addUnits([unit6, unit7, unit11], planetScene, Country.getCountryByName('china')!.color);
        (Country.getCountryByName('russia')!.addArmy(russianArmy3, planetScene) as LandArmy).addUnits([unit8], planetScene, Country.getCountryByName('russia')!.color);
        //russianArmy1.meleeAttack(russianArmy2);
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
            this.curArmy = this.tiles.getArmyByXYAndCountry(x, y, Country.getCurrentCountry());
            this.curArmy?.renderMovementRange();
            this.curArmy?.menu.render(planetScene, x, y);
        }
    }
}