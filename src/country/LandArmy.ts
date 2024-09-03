import { PlanetScene } from "~/scenes/PlanetScene";
import { Army } from "./Army";
import { PlanetUnit } from "~/unit/planet/PlanetUnit";
import { Tile } from "~/planet/Tile";
import { Country } from "./Country";
import { Unit } from "~/unit/Unit";
import { Scene } from "phaser";
import { Tiles } from "../planet/Tiles";
import { PlayScene } from "~/scenes/PlayScene";
import { Improvement } from "~/planet/improvement/Improvement";

export class LandArmy extends Army {
    protected _range: Phaser.GameObjects.Rectangle[];
    //movementPoints: number;
    constructor() {
        super();
        this._range = [];
    }

    override addUnits(target: Unit[], scene: Scene, color: string): Unit[] {
        super.addUnits(target);
        this.sortByCurrentMovementPoints();
        //this.updateMovementPoints();
        //let country = Country.getCountryByArmy(this);
        //console.log(country);
        //if (!country) throw new Error('Army is not in any country');
        this.renderLabel(scene as PlanetScene, color);
        this.renderIcon(scene);
        return target;
    }

    override removeUnits(target: Unit[], scene: Scene, color: string): Unit[] {
        super.removeUnits(target);
        this.sortByCurrentMovementPoints();
        //this.updateMovementPoints();
        //let country = Country.getCountryByArmy(this);
        //console.log(country);
        //if (!country) throw new Error('Army is not in any country');
        this.renderLabel(scene as PlanetScene, color);
        return target;
    }

    override create(x: number, y: number) {
        super.create(x, y);
    }

    getCurrentAllMovementPoints() {
        //this.movementPoints = Math.min(...this._units.map(unit => (unit as PlanetUnit).currentMovementPoints));
        //this._units.forEach(unit => (unit as PlanetUnit).currentMovementPoints = this.movementPoints);
        return Math.min(...this._units.map(unit => (unit as PlanetUnit).currentMovementPoints));
    }

    clearCurrentAllMovementPoints() {
        this._units.forEach(unit => (unit as PlanetUnit).currentMovementPoints = 0);
    }

    sortByCurrentMovementPoints() {
        this._units = this._units.sort((unit1, unit2) => (unit2 as PlanetUnit).currentMovementPoints - (unit1 as PlanetUnit).currentMovementPoints);
    }

    reduceCurrentMovementPoints(totalCost: number) {
        this._units.forEach(unit => (unit as PlanetUnit).currentMovementPoints -= totalCost);
    }

    move(x: number, y: number, range: Tile[], planetScene: PlanetScene, toArmy: LandArmy | null, improvement: Improvement | null) {
        let {x: newX, y: newY} = (this._sprite.scene as PlanetScene).toSceneCoords(x, y);
        if (!range.includes((this._sprite.scene as PlanetScene).planet.tiles.getTileByXY(newX, newY))) {
            this.clearRange();
            return;
        }
        let shortestPath = (this._sprite.scene as PlanetScene).planet.tiles.shortestPath(
            (this._sprite.scene as PlanetScene).planet.tiles.getTileByXY(this.x, this.y),
            (this._sprite.scene as PlanetScene).planet.tiles.getTileByXY(newX, newY)
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
        let callback = () => {
            console.log(10000000);
            this.clearRange();
            console.log(improvement);
            if (improvement) {
                let country = Country.getCurrentCountry();
                improvement.occupy(country, planetScene);
            }
            if (toArmy) {
                if (toArmy.getUnitsType() === this.getUnitsType() &&
                    Country.getCountryByArmy(toArmy) === Country.getCountryByArmy(this)) {
                    this.reduceCurrentMovementPoints(totalCost);
                    //this.updateMovementPoints();
                    this.addAllFromArmy(toArmy, planetScene, Country.getCountryByArmy(this)!.color);
                    Country.removeArmy(toArmy);
                }
                else if (Country.getCountryByArmy(toArmy) !== Country.getCountryByArmy(this)) {
                    this.meleeAttack(toArmy);
                    this.clearCurrentAllMovementPoints();
                    console.log(this);
                    if (this.getUnitsNumber()) {
                        if (toArmy.getUnitsNumber()) {
                            if (planetScene.planet.tiles.getArmyByXY(shortestPath[0].x, shortestPath[0].y)) {
                                planetScene.planet.tiles.getArmyByXY(shortestPath[0].x, shortestPath[0].y)!.addAllFromArmy(this, planetScene, Country.getCountryByArmy(this)!.color);
                                Country.removeArmy(this);
                            }
                            else {
                                let {x: pixelX2, y: pixelY2} = (this._sprite.scene as PlanetScene).toSceneCoordsPixels(shortestPath[0].x, shortestPath[0].y);
                                if (pixelX2 === null || pixelY2 === null) {
                                    throw new Error('Source position tile is null');
                                }
                                this._sprite.setPosition(pixelX2, pixelY2);
                                this.x = shortestPath[0].x;
                                this.y = shortestPath[0].y;
                                console.log(this);
                                let country = Country.getCountryByArmy(this);
                                if (!country) throw new Error('Army is not in any country');
                                this.renderLabel(planetScene, country.color);
                                this.menu.clearMenu();
                            }
                        }
                        else {
                            //this.reduceCurrentMovementPoints(totalCost);
                            //this.updateMovementPoints();
                            console.log(this);
                            let country = Country.getCountryByArmy(this);
                            if (!country) throw new Error('Army is not in any country');
                            this.renderLabel(planetScene, country.color);
                            this.menu.clearMenu();
                        }
                    }
                }
            }
            else {
                this.reduceCurrentMovementPoints(totalCost);
                //this.updateMovementPoints();
                console.log(this);
                let country = Country.getCountryByArmy(this);
                if (!country) throw new Error('Army is not in any country');
                this.renderLabel(planetScene, country.color);
                this.menu.clearMenu();
            }
            this.sortByCurrentMovementPoints();
        };
        //console.log(shortestPath);
        let timerId = setInterval((gen) => {
                let tile: Tile | null = next.next().value;
                //console.log(tile);
                if (!tile) {
                    clearInterval(timerId);
                    console.log(totalCost);
                    callback();
                    return;
                }
                /*if (tile.x === 5) {
                    tile.x = 1000;
                    tile.y = 1000;
                }*/
                let {x: pixelX, y: pixelY} = (this._sprite.scene as PlanetScene).toSceneCoordsPixels(tile.x, tile.y);
                if (pixelX === null || pixelY === null) {
                    clearInterval(timerId);
                    let {x: pixelX2, y: pixelY2} = (this._sprite.scene as PlanetScene).toSceneCoordsPixels(shortestPath[0].x, shortestPath[0].y);
                    if (pixelX2 === null || pixelY2 === null) {
                        throw new Error('Source position tile is null');
                    }
                    this._sprite.setPosition(pixelX2, pixelY2);
                    this.x = shortestPath[0].x;
                    this.y = shortestPath[0].y;
                    throw new Error('In-path position tile is null');
                }
                this._sprite.setPosition(pixelX, pixelY);
                this.x = tile.x;
                this.y = tile.y;
                totalCost += tile.movementCost;
            },
            250, next);
    }

    renderMovementRange() {
        this.clearRange();
        let range = (this._sprite.scene as PlanetScene).planet.tiles.getMovementRange(this);
        console.log(range);
        range.forEach((tile) => {
            let {x: pixelX, y: pixelY} = (this._sprite.scene as PlanetScene).toSceneCoordsPixels(tile.x, tile.y);
            console.log(pixelX, pixelY);
            if (pixelX === null || pixelY === null) {
                this.clearRange();
                throw new Error('Error in range building');
            }
            this._range.push(this._sprite.scene.add.rectangle(pixelX, pixelY, 64, 64, 0xff0000, 0.2).setOrigin(0,0))
        });
    }

    clearRange() {
        if (!this._range) return;
        this._range.forEach((rect) => {rect.destroy()});
        this._range = [];
    }

    transferOneFromArmy(army: Army, scene: Scene, color: string) {
        this.addUnits([(army as LandArmy)._units[0]], scene as PlanetScene, color);
        (army as LandArmy).removeUnits([this._units[0]], scene as PlanetScene, color);
    }

    addAllFromArmy(army: Army, scene: Scene, color: string) {
        this.addUnits((army as LandArmy)._units, scene as PlanetScene, color);
    }

    meleeAttack(army: Army) {
        let thisNumber = this.getUnitsNumber();
        let armyNumber = army.getUnitsNumber();

        let bigArmy;
        let smallArmy;
        let bigUnits;
        let smallUnits;
        let bigNumber;
        let smallNumber;
        if (thisNumber >= armyNumber) {
            bigArmy = this;
            smallArmy = army;
            bigUnits = this._units;
            smallUnits = (army as LandArmy)._units;
            bigNumber = thisNumber;
            smallNumber = armyNumber;
        }
        else {
            bigArmy = army;
            smallArmy = this;
            bigUnits = (army as LandArmy)._units;
            smallUnits = this._units;
            bigNumber = armyNumber;
            smallNumber = thisNumber;
        }
        //let extra = bigNumber % smallNumber;
        //let bonus = (bigNumber - extra) / smallNumber + Number(extra > 0);
        let bonus = 0;
        let extra = bigNumber;
        while (extra > 0) {
            console.log(extra);
            extra = extra - smallNumber;
            bonus++;
        }
        let diceRollWithBonusArr = bigUnits[0].meleeAttackDice.split('d');
        let diceRollWithBonus = (Number(diceRollWithBonusArr[0]) * bonus) + 'd' + diceRollWithBonusArr[1];
        let diceRollWithBonusExtra = (Number(diceRollWithBonusArr[0]) * (bonus - 1)) + 'd' + diceRollWithBonusArr[1];
        let attackerDeaths = 0;
        let defenderDeaths = 0;
        extra = -extra;
        for (let i = 0; i < smallNumber - extra; i++) {
            console.log(diceRollWithBonus + ':' + smallUnits[0].meleeAttackDice);
            let att = bigUnits[0].diceRoll(diceRollWithBonus);
            let def = smallUnits[0].diceRoll(smallUnits[0].meleeAttackDice);
            if (att > def) {
                defenderDeaths++;
            }
            else if (att < def) {
                attackerDeaths++;
            }
        }
        for (let i = smallNumber - extra; i < smallNumber; i++) {
            console.log(diceRollWithBonusExtra + ':' + smallUnits[0].meleeAttackDice);
            let att = bigUnits[0].diceRoll(diceRollWithBonusExtra);
            let def = smallUnits[0].diceRoll(smallUnits[0].meleeAttackDice);
            if (att > def) {
                defenderDeaths++;
            }
            else if (att < def) {
                attackerDeaths++;
            }
        }
        console.log(attackerDeaths, defenderDeaths);
        if (attackerDeaths) {
            if (attackerDeaths >= bigNumber) {
                (bigArmy as LandArmy).removeUnits(bigArmy._units, (bigArmy as LandArmy)._sprite.scene, Country.getCountryByArmy(bigArmy)!.color);
                Country.removeArmy(bigArmy);
            }
            else {
                //console.log(bigArmy);
                (bigArmy as LandArmy).removeUnits(bigArmy._units.slice(0, attackerDeaths), (bigArmy as LandArmy)._sprite.scene, Country.getCountryByArmy(bigArmy)!.color);
            }
        }
        if (defenderDeaths) {
            if (defenderDeaths >= smallNumber) {
                (smallArmy as LandArmy).removeUnits(smallArmy._units, (smallArmy as LandArmy)._sprite.scene, Country.getCountryByArmy(smallArmy)!.color);
                Country.removeArmy(smallArmy);
            }
            else {
                (smallArmy as LandArmy).removeUnits(smallArmy._units.slice(0, defenderDeaths), (bigArmy as LandArmy)._sprite.scene, Country.getCountryByArmy(smallArmy)!.color);
            }
        }
    }
}