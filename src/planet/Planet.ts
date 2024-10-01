import { Game } from "../game/Game";
import { Country } from "../country/Country";
import { PlanetScene } from "../scenes/PlanetScene";
import { Soldier } from "../unit/planet/martial/land/Soldier";
import { PlanetUnit } from "../unit/planet/PlanetUnit";
import { Town } from "./improvement/Town";
import { Village } from "./improvement/Village";
import { Tiles } from "./Tiles";
import { Unit } from "~/unit/Unit";
import { Tile } from "./Tile";
import { Army } from "~/country/Army";
import { LandArmy } from "../country/LandArmy";
import { SpaceArmy } from "~/country/SpaceArmy";
import { Scene } from "phaser";

export class Planet {
    name: string;
    curArmy: LandArmy | null;
    tiles: Tiles;
    activated: string;
    constructor(name) {
        this.name = name;
        this.tiles = new Tiles(this);
        this.activated = "none";
    }

    initTmp(planetScene: PlanetScene, game: Game) {
        new Country('russia', '#ff0000', planetScene);
        new Country('usa', '#0000ff', planetScene);
        new Country('china', '#00ff00', planetScene);
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

        let unit12 = new Soldier();
        let unit13 = new Soldier();
        let unit14 = new Soldier();
        let unit15 = new Soldier();

        //console.log(unit1.diceRoll('10d12'));
        let russianArmy1 = new LandArmy();
        let chinaArmy2 = new LandArmy();
        let usaArmy3 = new LandArmy();
        //russianArmy1.create(7, 3);
        //chinaArmy2.create(7, 4);
        //russianArmy3.create(6, 3);
        russianArmy1.create(9, 0, this);
        chinaArmy2.create(4, 9, this);
        usaArmy3.create(0, 0, this);
        (Country.getCountryByName('russia')!.addArmy(russianArmy1, planetScene) as LandArmy).addUnits([unit1, unit2, unit3, unit4, unit5], planetScene, Country.getCountryByName('russia')!.color);
        (Country.getCountryByName('china')!.addArmy(chinaArmy2, planetScene) as LandArmy).addUnits([unit6, unit7, unit8, unit9, unit10], planetScene, Country.getCountryByName('china')!.color);
        (Country.getCountryByName('usa')!.addArmy(usaArmy3, planetScene) as LandArmy).addUnits([unit11, unit12, unit13, unit14, unit15], planetScene, Country.getCountryByName('usa')!.color);
        //russianArmy1.meleeAttack(russianArmy2);
        //russianArmy1.movementRange();
        //this.curArmy = russianArmy1;
        let newyork = new Town();
        newyork.place(0, 0, 10000, planetScene, Country.getCountryByName('usa')!.genCityNames.next().value, Country.getCountryByName('usa')!);
        Country.getCountryByName('usa')!.addTile(this.tiles.getTileByXY(0, 0), planetScene);
        //Country.getCountryByName('usa')!.addTile(this.tiles.getTileByXY(2, 4), planetScene);
        //newyork.occupy(Country.getCountryByName('usa')!, planetScene);
        let moscow = new Town();
        moscow.place(9, 0, 10000, planetScene, Country.getCountryByName('russia')!.genCityNames.next().value, Country.getCountryByName('russia')!);
        Country.getCountryByName('russia')!.addTile(this.tiles.getTileByXY(9, 0), planetScene);
        //Country.getCountryByName('russia')!.addTile(this.tiles.getTileByXY(5, 3), planetScene);
        //Country.getCountryByName('russia')!.addTile(this.tiles.getTileByXY(6, 3), planetScene);
        console.log(Country.getCountryByName('russia'));
        //moscow.occupy(Country.getCountryByName('russia')!, planetScene);
        let beijing = new Town();
        beijing.place(4, 9, 1000, planetScene, Country.getCountryByName('china')!.genCityNames.next().value, Country.getCountryByName('china')!);
        Country.getCountryByName('china')!.addTile(this.tiles.getTileByXY(4, 9), planetScene);
        //beijing.occupy(Country.getCountryByName('china')!, planetScene);
        console.log(Country.allTiles());
        console.log(Country.getCountryByName('russia')!);
        console.log(Country.getCountryByName('usa')!);
        console.log(Country.getCountryByName('china')!);
    }

    chooseCurUnit(x: number, y: number, planetScene: PlanetScene): void {
        if (!Game.getInstance().turn.getCurrentCountry()) {
            throw new Error('No current country');
        }
        else {
            let tmp = this.tiles.getArmyByXY(x, y);
            if (tmp) {
                this.curArmy = Game.getInstance().turn.getCurrentCountry() === Country.getCountryByArmy(tmp) ? tmp : null;
                //this.curArmy?.renderMovementRange();
                this.curArmy?.menu.render(x, y, planetScene);
            }
        }
    }

    /*cancelMovingArmy(movingArmy: LandArmy | null, prevCurArmy: LandArmy, planetScene: PlanetScene) {
        console.log(200000000);
        this.curArmy?.cancelMovingArmy(movingArmy, prevCurArmy, planetScene);
        this.activated = "none";
        this.curArmy = null;
        console.log(Country.allArmies());
    }*/
}