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
    armies: Army[];
    tiles: Tile[];
    private static _countries: Map<string, Country> = new Map<string, Country>();
    constructor(name: string, color: string) {
        this.name = name;
        this.armies = [];
        this.tiles = [];
        this.color = color;
        Country._countries.set(name, this);
    }

    isContainsTile(target: Tile): boolean {
        return this.tiles.indexOf(target) >= 0;
    }

    isContainsArmy(target: Army): boolean {
        return this.armies.indexOf(target) >= 0;
    }

    addTile(target: Tile): Tile {
        this.tiles.push(target);
        return target;
    }

    addArmy(target: Army, scene: Scene): Army {
        this.armies.push(target);
        let country = Country.getCountryByArmy(target);
        console.log(country);
        if (!country) throw new Error('Army is not in any country');
        //if (target instanceof LandArmy || target instanceof SpaceArmy)
        //    target.addUnits(units, scene, country.color);
        //target.updateMovementPoints();
        return target;
    }

    static removeArmy(target: Army): void {
        target.clearIcon();
        target.clearLabel();
        Country.getCountryByArmy(target)!.armies.splice(Country.getCountryByArmy(target)!.armies.indexOf(target), 1);
    }

    static allTiles() {
        let pile: Tile[] = [];
        [...Country._countries.values()].forEach((country) => {pile.push(...country.tiles)});
        return pile;
    }

    static allArmies() {
        let pile: Army[] = [];
        [...Country._countries.values()].forEach((country) => {pile.push(...country.armies)});
        return pile;
    }

    static getCountryByTile(tile: Tile): Country | null {
        return [...Country._countries.values()].find((country) => {
            return country.isContainsTile(tile);
        }) ?? null;
    }

    static removeTileFromCountry(tile: Tile): void {
        let country = Country.getCountryByTile(tile);
        if (country) {
            country.tiles = country.tiles.filter((tile) => country.tiles.indexOf(tile), 1);
        }
    }

    static getCountryByName(name: string) {
        return Country._countries.get(name);
    }

    static getCurrentCountry() {
        let country = Country.getCountryByName(Game.getInstance().turn.country);
        if (!country) throw new Error('No current country');
        return country;
    }

    static getCountryByArmy(army: Army): Country | null {
        return [...Country._countries.values()].find(country => country.armies.indexOf(army) >= 0) ?? null;
    }
}