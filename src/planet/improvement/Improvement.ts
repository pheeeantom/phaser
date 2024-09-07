import { Game } from "../../game/Game";
import { Country } from "../../country/Country";
import { PlanetScene } from "~/scenes/PlanetScene";

export abstract class Improvement {

    protected _x: number;
    protected _y: number;
    terrainTypeId: number;
    name: string;
    constructor() {
        
    }

    place(x: number, y: number, population: number, planetScene: PlanetScene, name: string, country: Country) {
        this._x = x;
        this._y = y;
        this.name = name;

        let tile = planetScene.planet.tiles.getTileByXY(this._x, this._y);
        planetScene.terrainPlanetLayer.putTileAt(this.terrainTypeId, this._x, this._y);
        tile.improvement = this;
        tile.renderLabel(planetScene, this.name, country.color);
        country.addTile(tile);
    }

    occupy(country: Country, planetScene: PlanetScene) {
        let tile = planetScene.planet.tiles.getTileByXY(this._x, this._y);
        let prevCountry = Country.getCountryByTile(tile)!;
        //console.log(tile);
        Country.removeTileFromCountry(tile);
        country.addTile(tile);
        tile.renderLabel(planetScene, this.name, country.color);
        console.log(prevCountry);
        if (prevCountry.hasNoTiles()) {
            Game.getInstance().loseCountry(prevCountry, planetScene);
        }
    }
}