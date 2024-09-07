import { PlanetScene } from "~/scenes/PlanetScene";
import { Army } from "./Army";
import { PlanetUnit } from "~/unit/planet/PlanetUnit";
import { Tile } from "~/planet/Tile";
import { Country } from "./Country";
import { Unit } from "../unit/Unit";
import { Scene } from "phaser";
import { Tiles } from "../planet/Tiles";
import { PlayScene } from "~/scenes/PlayScene";
import { Improvement } from "~/planet/improvement/Improvement";
import { Game } from "../game/Game";
import { Planet } from "~/planet/Planet";
import { CreateablePlanet } from "../interfaces/Createable";

export class LandArmy extends Army implements CreateablePlanet<LandArmy> {
    protected _range: Phaser.GameObjects.Rectangle[];
    protected _planet: Planet;
    //movementPoints: number;
    constructor() {
        super();
        this._range = [];
    }

    getTile(): Tile {
        return this._planet.tiles.getTileByXY(this._x, this._y);
    }

    override addUnits(target: Unit[], scene: Scene, color: string): Unit[] {
        super.addUnits(target);
        this.sortByCurrentMovementPoints();
        //this.updateMovementPoints();
        //let country = Country.getCountryByArmy(this);
        //console.log(country);
        //if (!country) throw new Error('Army is not in any country');
        this.renderLabel(scene, color);
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
        this.renderLabel(scene, color);
        return target;
    }

    override create(x: number, y: number, planet: Planet): this {
        super.create(x, y);
        this._planet = planet;
        return this;
    }

    getCurrentAllMovementPoints() {
        //this.movementPoints = Math.min(...this._units.map(unit => (unit as PlanetUnit).currentMovementPoints));
        //this._units.forEach(unit => (unit as PlanetUnit).currentMovementPoints = this.movementPoints);
        return Math.min(...this._units.map(unit => (unit as PlanetUnit).currentMovementPoints));
    }

    getCurrentOneMovementPoints() {
        return (this._units[0] as PlanetUnit).currentMovementPoints;
    }

    clearCurrentAllMovementPoints() {
        this._units.forEach(unit => (unit as PlanetUnit).currentMovementPoints = 0);
    }

    protected sortByCurrentMovementPoints() {
        this._units.sort((unit1, unit2) => (unit2 as PlanetUnit).currentMovementPoints - (unit1 as PlanetUnit).currentMovementPoints);
    }

    protected reduceCurrentMovementPoints(totalCost: number) {
        this._units.forEach(unit => (unit as PlanetUnit).currentMovementPoints -= totalCost);
    }

    protected takeTile(planetScene: PlanetScene, tile: Tile): void {
        console.log(this);
        let country = Country.getCountryByArmy(this);
        if (!country) throw new Error('Army is not in any country');
        this.renderLabel(planetScene, country.color);
        this.menu.clear();
        let improvement = tile.improvement;
        if (improvement) {
            let country = Game.getInstance().turn.getCurrentCountry();
            improvement.occupy(country, planetScene);
        }
    }

    protected retreat(planetScene: PlanetScene, startTile: Tile): void {
        if (planetScene.planet.tiles.getArmyByXY(startTile.x, startTile.y)) {
            planetScene.planet.tiles.getArmyByXY(startTile.x, startTile.y)!.addAllFromArmy(this, planetScene, Country.getCountryByArmy(this)!.color);
            //this.remove();
            return;
        }
        /*let {x: pixelX2, y: pixelY2} = (this._sprite.scene as PlanetScene).toSceneCoordsPixels(startTile.x, startTile.y);
        if (pixelX2 === null || pixelY2 === null) {
            throw new Error('Source position tile is null');
        }*/
        this._sprite.setPosition(startTile.x*64, startTile.y*64);
        this._x = startTile.x;
        this._y = startTile.y;
        console.log(this);
        let country = Country.getCountryByArmy(this);
        if (!country) throw new Error('Army is not in any country');
        this.renderLabel(planetScene, country.color);
        this.menu.clear();
    }

    private postMove(planetScene: PlanetScene, toArmy: LandArmy | null, /*improvement: Improvement | null,*/ startTile: Tile, totalCost: number) {
        console.log(10000000);
        this.clearRange();
        //console.log(improvement);
        if (toArmy) {
            if (toArmy.getUnitsType() === this.getUnitsType() &&
                Country.getCountryByArmy(toArmy) === Country.getCountryByArmy(this)) {
                this.reduceCurrentMovementPoints(totalCost);
                //this.updateMovementPoints();
                this.addAllFromArmy(toArmy, planetScene, Country.getCountryByArmy(this)!.color);
                //toArmy.remove();
                //console.log(Country.getCountryByArmy(this)!.armies);
                return;
            }
            if (Country.getCountryByArmy(toArmy) !== Country.getCountryByArmy(this)) {
                console.log(111);
                this.meleeAttack(toArmy);
                //this.clearCurrentAllMovementPoints();
                console.log(this);
                if (this.getUnitsNumber()) {
                    if (toArmy.getUnitsNumber()) {
                        this.retreat(planetScene, startTile);
                        return;
                    }
                    //this.reduceCurrentMovementPoints(totalCost);
                    //this.updateMovementPoints();
                    this.takeTile(planetScene, this.getTile());
                }
            }
            return;
        }
        this.reduceCurrentMovementPoints(totalCost);
        //this.updateMovementPoints();
        this.takeTile(planetScene, this.getTile());
    }

    move(x: number, y: number, range: Tile[], planetScene: PlanetScene, maxMP: number) {
        let {x: newX, y: newY} = (this._sprite.scene as PlanetScene).toSceneCoords(x, y);
        let toArmy = planetScene.planet.tiles.getArmyByXY(newX, newY);
        //let improvement = planetScene.planet.tiles.getImprovementByXY(newX, newY);
        console.log(newX, newY);
        if (!range.includes((this._sprite.scene as PlanetScene).planet.tiles.getTileByXY(newX, newY))) {
            this.clearRange();
            return;
        }
        let shortestPath = (this._sprite.scene as PlanetScene).planet.tiles.shortestPath(
            (this._sprite.scene as PlanetScene).planet.tiles.getTileByXY(this._x, this._y),
            (this._sprite.scene as PlanetScene).planet.tiles.getTileByXY(newX, newY),
            maxMP
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
                if (!tile) {
                    clearInterval(timerId);
                    console.log(totalCost);
                    this.postMove(planetScene, toArmy, /*improvement,*/ shortestPath[shortestPath.length - 2], totalCost);
                    this.sortByCurrentMovementPoints();
                    return;
                }
                /*if (tile.x === 5) {
                    tile.x = 1000;
                    tile.y = 1000;
                }*/
                /*let {x: pixelX, y: pixelY} = (this._sprite.scene as PlanetScene).toSceneCoordsPixels(tile.x, tile.y);
                if (pixelX === null || pixelY === null) {
                    clearInterval(timerId);
                    let {x: pixelX2, y: pixelY2} = (this._sprite.scene as PlanetScene).toSceneCoordsPixels(shortestPath[shortestPath.length - 2].x, shortestPath[shortestPath.length - 2].y);
                    if (pixelX2 === null || pixelY2 === null) {
                        throw new Error('Source position tile is null');
                    }
                    this._sprite.setPosition(pixelX2, pixelY2);
                    this._x = shortestPath[shortestPath.length - 2].x;
                    this._y = shortestPath[shortestPath.length - 2].y;
                    throw new Error('In-path position tile is null');
                }*/
                this._sprite.setPosition(tile.x*64, tile.y*64);
                this._x = tile.x;
                this._y = tile.y;
                totalCost += tile.movementCost;
            },
            250, next);
    }

    /*cancelMovingArmy(movingArmy: LandArmy | null, prevCurArmy: LandArmy, planetScene: PlanetScene): void {
        if (movingArmy) {
            this.clearRange();
            //planetScene.planet.curArmy = prevCurArmy;
            prevCurArmy.addAllFromArmy(movingArmy, planetScene, Country.getCountryByArmy(movingArmy)!.color);
            movingArmy.remove();
        }
        prevCurArmy.clearRange();
    }*/

    renderMovementRange(range: Tile[]) {
        this.clearRange();
        //let range = (this._sprite.scene as PlanetScene).planet.tiles.getMovementRange(this, (this._sprite.scene as PlanetScene).planet.activated);
        console.log(range);
        range.forEach((tile) => {
            /*let {x: pixelX, y: pixelY} = (this._sprite.scene as PlanetScene).camera.camera.getWorldPoint(tile.x, tile.y);
            pixelX *= 64;
            pixelY *= 64;
            console.log(pixelX, pixelY);*/
            /*if (pixelX === null || pixelY === null) {
                this.clearRange();
                throw new Error('Error in range building');
            }*/
            this._range.push(this._sprite.scene.add.rectangle(tile.x*64, tile.y*64, 64, 64, 0xff0000, 0.2).setOrigin(0,0))
        });
    }

    clearRange() {
        if (!this._range) return;
        this._range.forEach((rect) => {rect.destroy()});
        this._range = [];
    }

    transferOneFromArmy(army: Army, scene: Scene, color: string) {
        if (army.getUnitsNumber() === 1) {
            this.addAllFromArmy(army, scene, color);
            return;
        }
        this.addUnits([(army as LandArmy)._units[0]], scene as PlanetScene, color);
        (army as LandArmy).removeUnits([this._units[0]], scene as PlanetScene, color);
    }

    addAllFromArmy(army: Army, scene: Scene, color: string) {
        this.addUnits((army as LandArmy)._units, scene as PlanetScene, color);
        army.remove();
    }

    restoreCurrentMovementPoints() {
        this._units.forEach(unit => (unit as PlanetUnit).restoreCurrentMovementPoints());
    }

    protected fight(att: string, def: string): [boolean, boolean] {
        console.log(att + ':' + def);
        let attPoints = Unit.diceRoll(att);
        let defPoints = Unit.diceRoll(def);
        let result: [boolean, boolean] = [false, false];
        if (attPoints > defPoints) {
            result[1] = true;
        }
        else if (attPoints < defPoints) {
            result[0] = true;
        }
        console.log(result);
        return result;
    }

    protected fightMany(num: number, att: string, def: string): [number, number] {
        let result: [number, number] = [0, 0];
        if (att.startsWith('0') || def.startsWith('0')) {
            return [0, 0];
        }
        for (let i = 0; i < num; i++) {
            let tmp = this.fight(att, def).map(death => +death) as [number, number];
            result[0] += tmp[0];
            result[1] += tmp[1];
        }
        return result;
    }

    protected fightAll(army: LandArmy): [number, number] {
        let thisNumber = this.getUnitsNumber();
        let armyNumber = army.getUnitsNumber();

        //let bigArmy: LandArmy;
        //let smallArmy: LandArmy;
        //let bigUnits: Unit[];
        //let smallUnits: Unit[];
        let bigNumber: number;
        let smallNumber: number;
        let attackerIsBig = thisNumber >= armyNumber;
        if (thisNumber >= armyNumber) {
            //bigArmy = this;
            //smallArmy = army as LandArmy;
            //bigUnits = this._units;
            //smallUnits = (army as LandArmy)._units;
            bigNumber = thisNumber;
            smallNumber = armyNumber;
        }
        else {
            //bigArmy = army as LandArmy;
            //smallArmy = this;
            //bigUnits = (army as LandArmy)._units;
            //smallUnits = this._units;
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
        let diceRollWithBonusArr = (attackerIsBig ? this : army)._units[0].meleeAttackDice.split('d');
        let diceRollWithBonus = (Number(diceRollWithBonusArr[0]) * bonus) + 'd' + diceRollWithBonusArr[1];
        let diceRollWithBonusExtra = (Number(diceRollWithBonusArr[0]) * (bonus - 1)) + 'd' + diceRollWithBonusArr[1];
        //let attackerDeaths = 0;
        //let defenderDeaths = 0;
        extra = -extra;
        let result1: [number, number];
        let result2: [number, number];
        if (attackerIsBig) {
            result1 = this.fightMany(smallNumber - extra, diceRollWithBonus, army._units[0].meleeAttackDice);
            result2 = this.fightMany(-(extra - smallNumber), diceRollWithBonusExtra, army._units[0].meleeAttackDice);
        }
        else {
            result1 = this.fightMany(smallNumber - extra, this._units[0].meleeAttackDice, diceRollWithBonus);
            result2 = this.fightMany(-(extra - smallNumber), this._units[0].meleeAttackDice, diceRollWithBonusExtra);
        }
        /*for (let i = 0; i < smallNumber - extra; i++) {
            let tmp = this.fight(att, def).map(death => +death) as [number, number];
            result[0] += tmp[0];
            result[1] += tmp[1];
        }
        for (let i = smallNumber - extra; i < smallNumber; i++) {
            let tmp = this.fight(att, def).map(death => +death) as [number, number];
            result[0] += tmp[0];
            result[1] += tmp[1];
        }*/
        return [result1[0] + result2[0], result1[1] + result2[1]];
    }

    kill(amount: number) {
        if (amount) {
            if (amount >= this.getUnitsNumber()) {
                //(smallArmy as LandArmy).removeUnits(smallArmy._units, (smallArmy as LandArmy)._sprite.scene, Country.getCountryByArmy(smallArmy)!.color);
                this.clearUnits();
                this.remove();
            }
            else {
                this.removeUnits(this._units.slice(0, amount), this._sprite.scene, Country.getCountryByArmy(this)!.color);
            }
        }
    }

    meleeAttack(army: Army) {
        let deaths = this.fightAll(army as LandArmy);
        /*for (let i = 0; i < smallNumber - extra; i++) {
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
        }*/
        console.log(deaths);
        /*if (deaths[0]) {
            if (deaths[0] >= this.getUnitsNumber()) {
                //(bigArmy as LandArmy).removeUnits(bigArmy._units, (bigArmy as LandArmy)._sprite.scene, Country.getCountryByArmy(bigArmy)!.color);
                this.remove();
            }
            else {
                //console.log(bigArmy);
                this.removeUnits(this._units.slice(0, deaths[0]), this._sprite.scene, Country.getCountryByArmy(this)!.color);
            }
        }
        if (deaths[1]) {
            if (deaths[1] >= army.getUnitsNumber()) {
                //(smallArmy as LandArmy).removeUnits(smallArmy._units, (smallArmy as LandArmy)._sprite.scene, Country.getCountryByArmy(smallArmy)!.color);
                army.remove();
            }
            else {
                (army as LandArmy).removeUnits((army as LandArmy)._units.slice(0, deaths[1]), (army as LandArmy)._sprite.scene, Country.getCountryByArmy(army)!.color);
            }
        }*/
        this.kill(deaths[0]);
        (army as LandArmy).kill(deaths[1]);
        this.clearCurrentAllMovementPoints();
    }

    pickOne(scene: Scene): LandArmy {
        let singleUnitArmy = new LandArmy();
        singleUnitArmy.create(this._x, this._y, this._planet);
        let movingArmy = singleUnitArmy;
        let country = Game.getInstance().turn.getCurrentCountry();
        movingArmy = country.addArmy(movingArmy, scene) as LandArmy;
        movingArmy.transferOneFromArmy(this, scene, country.color);
        this.clearRange();
        this.menu.clear();
        return movingArmy;
    }
}