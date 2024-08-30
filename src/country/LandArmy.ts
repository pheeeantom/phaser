import { PlanetScene } from "~/scenes/PlanetScene";
import { Army } from "./Army";
import { PlanetUnit } from "~/unit/planet/PlanetUnit";
import { Tile } from "~/planet/Tile";
import { Country } from "./Country";
import { Unit } from "~/unit/Unit";
import { Scene } from "phaser";

export class LandArmy extends Army {
    constructor() {
        super();
        this.range = [];
    }

    addUnit(target: Unit[], scene: Scene, color: string): Unit[] {
        this.addUnit0(target);
        //let country = Country.getCountryByArmy(this);
        //console.log(country);
        //if (!country) throw new Error('Army is not in any country');
        this.renderLabel(scene as PlanetScene, color);
        return target;
    }

    removeUnit(target: Unit[], scene: Scene, color: string): Unit[] {
        this.removeUnit0(target);
        //let country = Country.getCountryByArmy(this);
        //console.log(country);
        //if (!country) throw new Error('Army is not in any country');
        this.renderLabel(scene as PlanetScene, color);
        return target;
    }

    create(x: number, y: number) {
        this.create0(x, y);
    }

    move(x: number, y: number, range: Tile[], callback: Function) {
        let {x: newX, y: newY} = (this.sprite.scene as PlanetScene).toSceneCoords(x, y);
        if (!range.includes((this.sprite.scene as PlanetScene).planet.getTileByXY(newX, newY))) {
            return;
        }
        let shortestPath = (this.sprite.scene as PlanetScene).planet.tiles.shortestPath(
            (this.sprite.scene as PlanetScene).planet.getTileByXY(this.x, this.y),
            (this.sprite.scene as PlanetScene).planet.getTileByXY(newX, newY)
        );
        let generateSequence = function*() {
            for (let i = 1; i < shortestPath.length; i++) {
                yield shortestPath[i];
            }
            return null;
        }
        let generator = generateSequence();
        let next = generator;
        let totalCost = 0;
        //console.log(shortestPath);
        let timerId = setInterval((gen) => {
                let tile: Tile | null = next.next().value;
                //console.log(tile);
                if (!tile) { clearInterval(timerId); console.log(totalCost); callback(); return; }
                /*if (tile.x === 5) {
                    tile.x = 1000;
                    tile.y = 1000;
                }*/
                let {x: pixelX, y: pixelY} = (this.sprite.scene as PlanetScene).toSceneCoordsPixels(tile.x, tile.y);
                if (pixelX === null || pixelY === null) {
                    clearInterval(timerId);
                    let {x: pixelX2, y: pixelY2} = (this.sprite.scene as PlanetScene).toSceneCoordsPixels(shortestPath[0].x, shortestPath[0].y);
                    if (pixelX2 === null || pixelY2 === null) {
                        throw new Error('Source position tile is null');
                    }
                    this.sprite.setPosition(pixelX2, pixelY2);
                    this.x = shortestPath[0].x;
                    this.y = shortestPath[0].y;
                    throw new Error('In-path position tile is null');
                }
                this.sprite.setPosition(pixelX, pixelY);
                this.x = tile.x;
                this.y = tile.y;
                totalCost += tile.movementCost;
            },
            250, next);
    }

    movementRange() {
        this.clearRange();
        let range = (this.sprite.scene as PlanetScene).planet.tiles.movementRange(this);
        console.log(range);
        range.forEach((tile) => {
            let {x: pixelX, y: pixelY} = (this.sprite.scene as PlanetScene).toSceneCoordsPixels(tile.x, tile.y);
            console.log(pixelX, pixelY);
            if (pixelX === null || pixelY === null) {
                this.clearRange();
                throw new Error('Error in range building');
            }
            this.range.push(this.sprite.scene.add.rectangle(pixelX, pixelY, 64, 64, 0xff0000, 0.2).setOrigin(0,0))
        });
    }

    clearRange() {
        if (!this.range) return;
        this.range.forEach((rect) => {rect.destroy()});
        this.range = [];
    }

    renderLabel(planetScene: PlanetScene, color: string) {
        this.clearLabel();
        let {x: pixelX, y: pixelY} = planetScene.toSceneCoordsPixels(this.x, this.y);
        if (pixelX && pixelY) {
        console.log(String(this.units.length));
          this.label =
            planetScene.add.text(pixelX + 54, pixelY + 50, String(this.units.length),
            {color: color, backgroundColor: '#ffffff'}).setDepth(300);
        }
    }

    clearLabel() {
        this.label?.destroy();
    }
}