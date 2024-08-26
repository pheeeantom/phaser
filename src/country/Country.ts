import { Tile } from "~/planet/Tile";
import { Unit } from "~/unit/Unit";

export class Country {
    name: string;
    units: Unit[];
    tiles: Tile[];
    constructor(name: string, units: Unit[], tiles: Tile[]) {
        this.name = name;
        this.units = units;
        this.tiles = tiles;
    }
}