import { Game } from "../game/Game"
import { Tile } from "~/planet/Tile";
import { Unit } from "~/unit/Unit";
import { Army } from "./Army";
import { LandArmy } from "./LandArmy";
import { PlanetScene } from "~/scenes/PlanetScene";
import { Scene } from "phaser";

export class Country {
    name: string;
    color: string;
    armies: Army[];
    tiles: Tile[];
    private static countries: Map<string, Country> = new Map<string, Country>();
    constructor(name: string, color: string) {
        this.name = name;
        this.armies = [];
        this.tiles = [];
        this.color = color;
        Country.countries.set(name, this);
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

    addArmy(target: Army, units: Unit[], scene: Scene): Army {
        this.armies.push(target);
        target.addUnit(units, scene);
        target.updateMovementPoints();
        target.sprite = scene.physics.add.sprite(64*target.x, 64*target.y, target.units[0].name).setOrigin(0, 0).setDepth(200);
        if (target instanceof LandArmy) {
            target.renderLabel(target.sprite.scene as PlanetScene, this.color);
        }
        return target;
    }

    static allTiles() {
        let pile: Tile[] = [];
        [...Country.countries.values()].forEach((country) => {pile.push(...country.tiles)});
        return pile;
    }

    static allArmies() {
        let pile: Army[] = [];
        [...Country.countries.values()].forEach((country) => {pile.push(...country.armies)});
        return pile;
    }

    static getCountryByTile(tile: Tile): Country | null {
        return [...Country.countries.values()].find((country) => {
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
        return Country.countries.get(name);
    }

    static getCurrentCountry() {
        let country = Country.getCountryByName(Game.getInstance().turn.country);
        if (!country) throw new Error('No current country');
        return country;
    }

    static getCountryByArmy(army: Army): Country | null {
        return [...Country.countries.values()].find(country => country.armies.indexOf(army) >= 0) ?? null;
    }
}