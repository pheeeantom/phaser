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
import { isRangedAttacker, RangedAttacker } from "../interfaces/RangedAttacker";
import { AirAttacker } from "../interfaces/AirAttacker";
import { isShippable, Shippable } from "../interfaces/Marine";
import _ from "lodash";

export class LandArmy extends Army implements CreateablePlanet<LandArmy> {
    protected _range: Phaser.GameObjects.Ellipse[];
    protected _planet: Planet;
    //movementPoints: number;
    constructor() {
        super();
        this._range = [];
    }

    getTile(): Tile {
        return this._planet.tiles.getTileByXY(this._x, this._y);
    }

    getUnitsMaxNum(): number {
        const firstUnit = (this._units[0] as PlanetUnit);
        return firstUnit ? firstUnit.maxNum : Number.POSITIVE_INFINITY;
    }

    override addUnits(target: Unit[], scene: Scene, color: string): Unit[] {
        /*if (this.getUnitsNumber() + target.length > this.getUnitsMaxNum()) {
            return [];
        }*/
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

    getCurrentShootMovementPoints() {
        return ((this._units[0] as unknown) as RangedAttacker).range;
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
        /*let improvement = tile.improvement;
        if (improvement) {
            let country = Game.getInstance().turn.getCurrentCountry();
            improvement.occupy(country, planetScene);
        }*/
        let countryNew = Game.getInstance().turn.getCurrentCountry();
        tile.occupy(countryNew, planetScene);
        /*if (isShippable(this.getFirstUnit()) && (tile.water &&
            !((this.getFirstUnit() as unknown) as Shippable).flag_shippable) ||
            (!tile.water && ((this.getFirstUnit() as unknown) as Shippable).flag_shippable)) {
            this.toggleShip(planetScene);
        }*/
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
        if (isShippable(this.getFirstUnit()) && (startTile.water &&
            !((this.getFirstUnit() as unknown) as Shippable).flag_shippable) ||
            (!startTile.water && ((this.getFirstUnit() as unknown) as Shippable).flag_shippable)) {
            this.toggleShip(planetScene);
        }
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

                /*if (isShippable(this.getFirstUnit()) && (this.getTile().water &&
                    !((this.getFirstUnit() as unknown) as Shippable).flag_shippable) ||
                    (!this.getTile().water && ((this.getFirstUnit() as unknown) as Shippable).flag_shippable)) {
                    this.toggleShip(planetScene);
                }*/

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

        if (toArmy && Country.getCountryByArmy(toArmy) === Country.getCountryByArmy(this) &&
            this.getUnitsNumber() + (toArmy as LandArmy).getUnitsNumber() > this.getUnitsMaxNum()) {
            this.clearRange();
            return;
        }

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
                if (tile !== shortestPath[shortestPath.length - 1]) {
                    let countryNew = Game.getInstance().turn.getCurrentCountry();
                    tile.occupy(countryNew, planetScene);
                }
                if (isShippable(this.getFirstUnit()) && (tile.water &&
                    !((this.getFirstUnit() as unknown) as Shippable).flag_shippable) ||
                    (!tile.water && ((this.getFirstUnit() as unknown) as Shippable).flag_shippable)) {
                    this.toggleShip(planetScene);
                }
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
            this._range.push(this._sprite.scene.add.ellipse(tile.x*64 + 26, tile.y*64 + 26, 12, 12, 0x00000, 1).setOrigin(0,0).setDepth(1000));
        });
    }

    clearRange() {
        if (!this._range) return;
        this._range.forEach((rect) => {rect.destroy()});
        this._range = [];
    }

    transferOneFromArmy(army: Army, scene: Scene, color: string) {
        /*if (this.getUnitsNumber() + 1 > this.getUnitsMaxNum()) {
            return;
        }*/
        if (army.getUnitsNumber() === 1) {
            this.addAllFromArmy(army, scene, color);
            return;
        }
        this.addUnits([(army as LandArmy)._units[0]], scene as PlanetScene, color);
        (army as LandArmy).removeUnits([this._units[0]], scene as PlanetScene, color);
    }

    addAllFromArmy(army: Army, scene: Scene, color: string) {
        /*if (this.getUnitsNumber() + army.getUnitsNumber() > this.getUnitsMaxNum()) {
            return;
        }*/
        console.log(this, army);
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
        let diceRollWithBonusArr = /*(attackerIsBig ? this : army)._units[0].meleeAttackDice*/(attackerIsBig ? this : army)._units[0].meleeAttackDice.split('d');
        let diceRollWithBonus = (Number(diceRollWithBonusArr[0]) * bonus) + 'd' + diceRollWithBonusArr[1];
        let diceRollWithBonusExtra = (Number(diceRollWithBonusArr[0]) * (bonus - 1)) + 'd' + diceRollWithBonusArr[1];
        //let attackerDeaths = 0;
        //let defenderDeaths = 0;
        extra = -extra;
        let result1: [number, number];
        let result2: [number, number];
        if (attackerIsBig) {
            if ((isShippable(this.getFirstUnit()) && (this.getFirstUnit() as unknown as Shippable).flag_shippable) &&
                (isShippable(army.getFirstUnit()) && (army.getFirstUnit() as unknown as Shippable).flag_shippable)) {
                result1 = this.fightMany(smallNumber - extra, diceRollWithBonus.split('d')[0] + 'd2', '1d2');
                result2 = this.fightMany(extra, diceRollWithBonusExtra.split('d')[0] + 'd2', '1d2');
            }
            else if (isShippable(this.getFirstUnit()) && (this.getFirstUnit() as unknown as Shippable).flag_shippable) {
                result1 = this.fightMany(smallNumber - extra, diceRollWithBonus.split('d')[0] + 'd2', army._units[0].meleeAttackDice);
                result2 = this.fightMany(extra, diceRollWithBonusExtra.split('d')[0] + 'd2', army._units[0].meleeAttackDice);
            }
            else if (isShippable(army.getFirstUnit()) && (army.getFirstUnit() as unknown as Shippable).flag_shippable) {
                result1 = this.fightMany(smallNumber - extra, diceRollWithBonus, '1d2');
                result2 = this.fightMany(extra, diceRollWithBonusExtra, '1d2');
            }
            else {
                result1 = this.fightMany(smallNumber - extra, diceRollWithBonus, army._units[0].meleeAttackDice);
                result2 = this.fightMany(extra, diceRollWithBonusExtra, army._units[0].meleeAttackDice);
            }
        }
        else {
            if ((isShippable(this.getFirstUnit()) && (this.getFirstUnit() as unknown as Shippable).flag_shippable) &&
                (isShippable(army.getFirstUnit()) && (army.getFirstUnit() as unknown as Shippable).flag_shippable)) {
                result1 = this.fightMany(smallNumber - extra, '1d2', diceRollWithBonus.split('d')[0] + 'd2');
                result2 = this.fightMany(extra, '1d2', diceRollWithBonusExtra.split('d')[0] + 'd2');
            }
            else if (isShippable(this.getFirstUnit()) && (this.getFirstUnit() as unknown as Shippable).flag_shippable) {
                result1 = this.fightMany(smallNumber - extra, '1d2', diceRollWithBonus);
                result2 = this.fightMany(extra, '1d2', diceRollWithBonusExtra);
            }
            else if (isShippable(army.getFirstUnit()) && (army.getFirstUnit() as unknown as Shippable).flag_shippable) {
                result1 = this.fightMany(smallNumber - extra, this._units[0].meleeAttackDice, diceRollWithBonus.split('d')[0] + 'd2');
                result2 = this.fightMany(extra, this._units[0].meleeAttackDice, diceRollWithBonusExtra.split('d')[0] + 'd2');
            }
            else {
                result1 = this.fightMany(smallNumber - extra, this._units[0].meleeAttackDice, diceRollWithBonus);
                result2 = this.fightMany(extra, this._units[0].meleeAttackDice, diceRollWithBonusExtra);
            }
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
    
    private playAttackAnim() {
        let anim = this._sprite.scene.physics.add.sprite(64*this._x, 64*this._y, "attack").setOrigin(0, 0).setDepth(1000);
        _.delay(() => anim.destroy(), 200);
        _.delay(() => anim = this._sprite.scene.physics.add.sprite(64*this._x, 64*this._y, "attack").setOrigin(0, 0).setDepth(1000), 300);
        _.delay(() => anim.destroy(), 400);
        _.delay(() => anim = this._sprite.scene.physics.add.sprite(64*this._x, 64*this._y, "attack").setOrigin(0, 0).setDepth(1000), 500);
        _.delay(() => anim.destroy(), 600);
        for (let i = 0; i < 3; i++) {
            _.delay(() => anim = this._sprite.scene.physics.add.sprite(64*this._x, 64*this._y, "attack").setOrigin(0, 0).setDepth(1000), 600 + ((i * 2 + 1) * 60));
            _.delay(() => anim.destroy(), 600 + ((i * 2 + 2) * 60));
        }
    }

    kill(amount: number) {
        this.playAttackAnim();
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
        Game.getInstance().economic.mainPanel.setMessage("Enemy killed: " + deaths[0] + " " + this.getUnitsType() +
            ", you killed: " + deaths[1] + " " + army.getUnitsType());
        this.kill(deaths[0]);
        (army as LandArmy).kill(deaths[1]);
        this.clearCurrentAllMovementPoints();
    }

    shoot(army: Army) {
        let deaths = this.fightMany(/*(this.getUnitsNumber() > army.getUnitsNumber() ?
            army.getUnitsNumber() : this.getUnitsNumber())*/
            this.getUnitsNumber(), ((this.getFirstUnit() as unknown) as RangedAttacker).rangedAttackDice,
            army.getFirstUnit().meleeAttackDice);
        if (deaths[0] > this.getUnitsNumber()) {
            deaths[0] = this.getUnitsNumber();
        }
        if (deaths[1] > army.getUnitsNumber()) {
            deaths[1] = army.getUnitsNumber();
        }
        Game.getInstance().economic.mainPanel.setMessage("You killed with shooting: " + deaths[1] + " " + army.getUnitsType());
        (army as LandArmy).kill(deaths[1]);
        this.clearCurrentAllMovementPoints();
    }

    airAttack(army: Army) {
        let deaths = this.fightMany(/*(this.getUnitsNumber() > army.getUnitsNumber() ?
            army.getUnitsNumber() : this.getUnitsNumber())*/
            this.getUnitsNumber(), ((this.getFirstUnit() as unknown) as AirAttacker).airAttackDice,
            army.getFirstUnit().meleeAttackDice);
        if (deaths[0] > this.getUnitsNumber()) {
            deaths[0] = this.getUnitsNumber();
        }
        if (deaths[1] > army.getUnitsNumber()) {
            deaths[1] = army.getUnitsNumber();
        }
        Game.getInstance().economic.mainPanel.setMessage("Killed with air attack: " + deaths[1] + " " + army.getUnitsType() +
            ", lost: " + deaths[0] + " " + this.getUnitsType());
        this.kill(deaths[0]);
        (army as LandArmy).kill(deaths[1]);
        this.clearCurrentAllMovementPoints();
    }

    canShoot() {
        if (!isRangedAttacker(this.getFirstUnit())) {
            return false;
        }
        if (this.getCurrentAllMovementPoints() >= (this._units[0] as PlanetUnit).movementPoints) {
            return true;
        }
        return false;
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

    toggleShip(planetScene: PlanetScene) {
        this._sprite.destroy();
        if ((this.getFirstUnit() as unknown as Shippable).flag_shippable) {
            this._sprite = planetScene.physics.add.sprite(64*this._x, 64*this._y, this.getUnitsType()).setOrigin(0, 0).setDepth(200);
        }
        else {
            this._sprite = planetScene.physics.add.sprite(64*this._x, 64*this._y, 'ship').setOrigin(0, 0).setDepth(200);
        }
        this._units.forEach(unit => {
            let shippable = unit as unknown as Shippable;
            shippable.flag_shippable = !shippable.flag_shippable;
        });
        console.log("kekes", (this.getFirstUnit() as unknown as Shippable).flag_shippable);
    }
}