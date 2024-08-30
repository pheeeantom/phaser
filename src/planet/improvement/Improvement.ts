import { Country } from "../../country/Country";
import { PlanetScene } from "~/scenes/PlanetScene";

export class Improvement {

    x: number;
    y: number;
    population: number;
    terrainTypeId: number;
    name: string;
    constructor() {
        
    }

    place(x: number, y: number, population: number, planetScene: PlanetScene, name: string) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.population = population;

        let country = Country.getCurrentCountry();
        let tile = planetScene.planet.getTileByXY(this.x, this.y);
        planetScene.terrainPlanetLayer.putTileAt(this.terrainTypeId, this.x, this.y);
        tile.improvement = this;
        tile.renderLabel(planetScene, this.name, country.color);
        country.addTile(tile);
    }

    occupy(country: Country, planetScene: PlanetScene) {
        let tile = planetScene.planet.getTileByXY(this.x, this.y);
        Country.removeTileFromCountry(tile);
        country.addTile(tile);
        tile.renderLabel(planetScene, this.name, country.color);
    }
}