/*import { Country } from "../country/Country";
import { LandArmy } from "../country/LandArmy";
import { PlanetScene } from "../scenes/PlanetScene";
import { Soldier } from "../unit/planet/martial/land/Soldier";

export class Turn {
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
            let newArmy = new LandArmy();
            let curArmy = planetScene.planet.tiles.getArmyByXYAndCountry(tile.x, tile.y, Country.getCountryByName(this.country)!);
            if (curArmy) {
                newArmy.addAllFromArmy(curArmy, planetScene, Country.getCountryByName(this.country)!.color);
                Country.removeArmy(curArmy);
            }
            newArmy.create(tile.x, tile.y);
            (Country.getCountryByName(this.country)!.addArmy(newArmy, planetScene) as LandArmy).addUnits([new Soldier()], planetScene, Country.getCountryByName(this.country)!.color);
        });
    }
}*/