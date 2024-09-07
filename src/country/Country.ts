import { Game } from "../game/Game"
import { Tile } from "~/planet/Tile";
import { Unit } from "~/unit/Unit";
import { Army } from "./Army";
import { LandArmy } from "./LandArmy";
import { PlanetScene } from "~/scenes/PlanetScene";
import { Scene } from "phaser";
import { SpaceArmy } from "./SpaceArmy";

export class Country {
    name: string;
    color: string;
    private _armies: Army[];
    private _tiles: Tile[];
    private static _countries: Map<string, Country> = new Map<string, Country>();
    constructor(name: string, color: string) {
        this.name = name;
        this._armies = [];
        this._tiles = [];
        this.color = color;
        Country._countries.set(name, this);
    }

    private isContainsTile(target: Tile): boolean {
        return this._tiles.indexOf(target) >= 0;
    }

    private isContainsArmy(target: Army): boolean {
        return this._armies.indexOf(target) >= 0;
    }

    addTile(target: Tile): Tile {
        this._tiles.push(target);
        return target;
    }

    addArmy(target: Army, scene: Scene): Army {
        this._armies.push(target);
        let country = Country.getCountryByArmy(target);
        console.log(country);
        if (!country) throw new Error('Army is not in any country');
        //if (target instanceof LandArmy || target instanceof SpaceArmy)
        //    target.addUnits(units, scene, country.color);
        //target.updateMovementPoints();
        return target;
    }

    removeAllArmies() {
        for (let i = this._armies.length - 1; i >= 0; i--) {
            this._armies[i].remove();
        }
    }

    restoreCurrentMovementPoints() {
        this._armies.forEach(army => (army as LandArmy).restoreCurrentMovementPoints());
    }

    hasNoTiles(): boolean {
        return this._tiles.length === 0;
    }

    tmpSpawnUnitAll(planetScene: PlanetScene) {
        this._tiles.forEach(tile => {
            tile.tmpSpawnUnit(planetScene, this);
        });
    }

    static removeArmy(army: Army) {
        Country.getCountryByArmy(army)!._armies.splice(Country.getCountryByArmy(army)!._armies.indexOf(army), 1);
    }

    static removeCountry(target: Country) {
        Country._countries.delete(target.name);
    }

    static allTiles() {
        let pile: Tile[] = [];
        [...Country._countries.values()].forEach((country) => {pile.push(...country._tiles)});
        return pile;
    }

    static allArmies() {
        let pile: Army[] = [];
        [...Country._countries.values()].forEach((country) => {pile.push(...country._armies)});
        return pile;
    }

    static allCountries() {
        return Country._countries;
    }

    static getCountryByTile(tile: Tile): Country | null {
        return [...Country._countries.values()].find((country) => {
            return country.isContainsTile(tile);
        }) ?? null;
    }

    static removeTileFromCountry(tile: Tile): void {
        let country = Country.getCountryByTile(tile);
        console.log(country);
        if (country) {
            country._tiles.splice(country._tiles.indexOf(tile), 1);
            console.log(country._tiles);
        }
    }

    static getCountryByName(name: string) {
        return Country._countries.get(name);
    }

    static getCountryByArmy(army: Army): Country | null {
        return [...Country._countries.values()].find(country => country._armies.indexOf(army) >= 0) ?? null;
    }
}