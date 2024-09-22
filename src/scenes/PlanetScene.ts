import { GameObjects, Scene } from "phaser";
import { Planet } from "../planet/Planet";
import { Game } from "../game/Game";
import { PlanetUnit } from "../unit/planet/PlanetUnit";
import { Country } from "../country/Country";
import { Camera } from "../game/Camera";
import { LandArmy } from "../country/LandArmy";
import { Army } from "~/country/Army";
import { Tiles } from "../planet/Tiles";
import { Improvement } from "~/planet/improvement/Improvement";
import { Economic } from "../game/Economic";
import { PlayScene } from "./PlayScene";
import { Soldier } from "../unit/planet/martial/land/Soldier";
import { Village } from "../planet/improvement/Village";
import { Town } from "../planet/improvement/Town";
import { City } from "../planet/improvement/City";
import { Farm } from "../planet/improvement/Farm";
import { Mine } from "../planet/improvement/Mine";
import { Artillery } from "../unit/planet/martial/land/Artillery";
import { Tank } from "../unit/planet/martial/land/Tank";
import { AirCraft } from "../unit/planet/martial/air/AirCraft";
import { Destroyer } from "../unit/planet/martial/marine/Destroyer";
import { BattleShip } from "../unit/planet/martial/marine/BattleShip";
import { Locality } from "../planet/improvement/Locality";
import { LAND, WATER } from "../interfaces/Marine";
import { Factory } from "../planet/improvement/Factory";

export class PlanetScene extends Scene{

  planetMap!: Phaser.Tilemaps.Tilemap;
  terrainPlanet!: Phaser.Tilemaps.Tileset;
  terrainPlanetLayer!: Phaser.Tilemaps.TilemapLayer;
  planet: Planet;
  camera: Camera;
  additionalCamera: Phaser.Cameras.Scene2D.Camera;
  //curUnit!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  //curUnit: PlanetUnit | null;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  playScene: PlayScene;

  constructor(){
    super("planet");
  }

  toSceneCoords(x: number, y: number) {
    let {x: tmpX, y: tmpY} = this.cameras.main.getWorldPoint(x, y);
    let phaserTileStart = this.terrainPlanetLayer.getTileAtWorldXY(tmpX, tmpY);
    let newX = phaserTileStart.x;
    let newY = phaserTileStart.y;
    return {x: newX, y: newY};
  }

  /*toSceneCoordsPixels(x: number, y: number): {x: number | null, y: number | null} {
    let phaserTile = this.terrainPlanetLayer.tilemap.getTileAt(x, y);
    return phaserTile ? {x: phaserTile.pixelX, y: phaserTile.pixelY} : {x: null, y: null};
  }*/

  init(data){
    this.planet = data.planet;
    this.playScene = data.playscene;
  }

  preload(){
  	
  }

  create(){
    /*this.additionalCamera = this.cameras.add();
    this.additionalCamera.addToRenderList(Game.getInstance().economic.mainPanel.mainMenu);
    this.additionalCamera.ignore(GameObjects.)
    this.cameras.main.ignore(Game.getInstance().economic.mainPanel.mainMenu);*/
    this.camera = new Camera(this.cameras.main);

  	this.planetMap = this.add.tilemap(this.planet.name);

    this.terrainPlanet = this.planetMap.addTilesetImage(this.planet.name + "_terrain", this.planet.name + "_terrain_img")!;

    this.terrainPlanetLayer = this.planetMap.createLayer("terrain", [this.terrainPlanet], 0, 0)!.setDepth(-1);
    //console.log(this.terrainPlanetLayer);

    //this.curUnit = this.physics.add.sprite(64*7, 64*3, 'soldier').setOrigin(0, 0);

    //this.physics.world.bounds.width = this.planetMap.widthInPixels;
    //this.physics.world.bounds.height = this.planetMap.heightInPixels;
    //this.curUnit.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.cameras.main.setBounds(-64, -64, this.planetMap.widthInPixels + 128, this.planetMap.heightInPixels + 128);
    this.cameras.main.roundPixels = true;

    this.input.on("wheel",  (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      this.camera.zoomHandler(deltaY);
    });

    this.planet.tiles.generateTiles(this);
                                  this.planet.initTmp(this, Game.getInstance());

    //Game.getInstance().turn.getCurrentCountry().tmpSpawnUnitAll(this);
    Game.getInstance().economic.mainPanel.setMessage("+" + Game.getInstance().turn.getCurrentCountry().income() + "$");
    Game.getInstance().economic.mainPanel.setInfo(this.playScene);
    //Game.getInstance().economic.mainPanel.setMessage("Game starts...");


    //let prevCurArmy: LandArmy;
    //let movingArmy: LandArmy | null;
    let maxMP: number = 0;
    this.input.on("pointerup",  (pointer) => {
      if (Game.getInstance().economic.menuClicked) {
        Game.getInstance().economic.menuClicked = false;
        return;
      }
      console.log(Game.getInstance().economic.activated);
      if (Game.getInstance().economic.activated === "soldier" || Game.getInstance().economic.activated === "artillery" ||
        Game.getInstance().economic.activated === "tank" || Game.getInstance().economic.activated === "aircraft" ||
        Game.getInstance().economic.activated === "destroyer" || Game.getInstance().economic.activated === "battleship") {
        let {x: newX, y: newY} = this.toSceneCoords(pointer.x, pointer.y);
        let curArmy = this.planet.tiles.getArmyByXY(newX, newY);
        let tileOn = this.planet.tiles.getTileByXY(newX, newY);
        let unit;
        if (Game.getInstance().economic.activated === "soldier") {
          unit = Soldier;
        }
        else if (Game.getInstance().economic.activated === "artillery") {
          unit = Artillery;
        }
        else if (Game.getInstance().economic.activated === "tank") {
          unit = Tank;
        }
        else if (Game.getInstance().economic.activated === "aircraft") {
          unit = AirCraft;
        }
        else if (Game.getInstance().economic.activated === "destroyer") {
          unit = Destroyer;
        }
        else if (Game.getInstance().economic.activated === "battleship") {
          unit = BattleShip;
        }
        if (!(new unit().landWater & WATER) && tileOn.water) {
          Game.getInstance().economic.mainPanel.setMessage("You can't place a " + Game.getInstance().economic.activated +
            " on water while it is not marine...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (!(new unit().landWater & LAND) && !tileOn.water) {
          Game.getInstance().economic.mainPanel.setMessage("You can't place a " + Game.getInstance().economic.activated +
            " on land while it is not landy...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (curArmy) {
          if (curArmy.getUnitsType() !== Game.getInstance().economic.activated) {
            Game.getInstance().economic.mainPanel.setMessage("You can't place a " + Game.getInstance().economic.activated +
              " on not a " + Game.getInstance().economic.activated + "...");
            Game.getInstance().economic.activated = "none";
            return;
          }
          else if (curArmy.getUnitsNumber() + 1 > curArmy.getUnitsMaxNum()) {
            Game.getInstance().economic.mainPanel.setMessage("You can't have more than " + curArmy.getUnitsMaxNum() + " " + Game.getInstance().economic.activated + " on one tile...");
            Game.getInstance().economic.activated = "none";
            return;
          }
          else if (Country.getCountryByArmy(curArmy) !== Game.getInstance().turn.getCurrentCountry()) {
            Game.getInstance().economic.mainPanel.setMessage("You can't place a " + Game.getInstance().economic.activated + " on an enemy...");
            Game.getInstance().economic.activated = "none";
            return;
          }
        }
        if (Game.getInstance().turn.getCurrentCountry().money < unit.cost) {
          Game.getInstance().economic.mainPanel.setMessage("Not enough money (" + Game.getInstance().economic.activated + " price is " + unit.cost + "$)...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Country.getCountryByTile(tileOn) !== Game.getInstance().turn.getCurrentCountry()) {
          Game.getInstance().economic.mainPanel.setMessage("You can place a " + Game.getInstance().economic.activated + " only on your territory...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        tileOn.spawnUnit(this, Game.getInstance().turn.getCurrentCountry(), unit);
        Game.getInstance().turn.getCurrentCountry().money -= unit.cost;
        Game.getInstance().economic.mainPanel.setInfo(this.playScene);
        Game.getInstance().economic.mainPanel.setMessage("OK");
        Game.getInstance().economic.activated = "none";
        return;
      }
      if (Game.getInstance().economic.activated === "village" || Game.getInstance().economic.activated === "farm" ||
        Game.getInstance().economic.activated === "mine" || Game.getInstance().economic.activated === "upgrade" ||
        Game.getInstance().economic.activated === "factory") {
        let {x: newX, y: newY} = this.toSceneCoords(pointer.x, pointer.y);
        let curArmy = this.planet.tiles.getArmyByXY(newX, newY);
        let tileOn = this.planet.tiles.getTileByXY(newX, newY);
        let building;
        if (Game.getInstance().economic.activated === "village") {
          building = Village;
        }
        else if (Game.getInstance().economic.activated === "farm") {
          building = Farm;
        }
        else if (Game.getInstance().economic.activated === "mine") {
          building = Mine;
        }
        else if (Game.getInstance().economic.activated === "factory") {
          if (!Game.getInstance().turn.getCurrentCountry().canPlaceFactory()) {
            Game.getInstance().economic.mainPanel.setMessage("There should be at least 3 mines per 1 factory...");
            Game.getInstance().economic.activated = "none";
            return;
          }
          building = Factory;
        }
        else if (Game.getInstance().economic.activated === "upgrade") {
          if (tileOn.improvement instanceof Village) {
            building = Town;
          }
          else if (tileOn.improvement instanceof Town) {
            building = City;
          }
          else {
            Game.getInstance().economic.mainPanel.setMessage("You can upgrade only a village or a town...");
            Game.getInstance().economic.activated = "none";
            return;
          }
        }
        if (Game.getInstance().turn.getCurrentCountry().money < building.cost) {
          Game.getInstance().economic.mainPanel.setMessage("Not enough money (" + Game.getInstance().economic.activated + " price is " + building.cost + "$)...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Country.getCountryByTile(tileOn) !== Game.getInstance().turn.getCurrentCountry()) {
          Game.getInstance().economic.mainPanel.setMessage("You can place a " + Game.getInstance().economic.activated + " only on your territory...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (tileOn.improvement && Game.getInstance().economic.activated !== "upgrade") {
          Game.getInstance().economic.mainPanel.setMessage("You can place a " + Game.getInstance().economic.activated + " only where no other buildings...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (!building.acceptableTerrains.includes(tileOn.terrainTypeId)) {
          Game.getInstance().economic.mainPanel.setMessage("You can place a " + Game.getInstance().economic.activated + " only on " + Tiles.getNamesOfTerrains(building.acceptableTerrains).join(" or ") + "...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        let name;
        if (Game.getInstance().economic.activated === "village") {
          name = Game.getInstance().turn.getCurrentCountry().genCityNames.next().value;
        }
        else if (Game.getInstance().economic.activated === "upgrade") {
          name = tileOn.improvement!.name;
        }
        else {
          name = Game.getInstance().economic.activated;
        }
        new building().place(newX, newY, 1000, this, name, Game.getInstance().turn.getCurrentCountry());
        Game.getInstance().turn.getCurrentCountry().money -= building.cost;
        Game.getInstance().economic.mainPanel.setInfo(this.playScene);
        Game.getInstance().economic.mainPanel.setMessage("OK");
        Game.getInstance().economic.activated = "none";
        return;
      }
      /*if (Game.getInstance().economic.activated === "upgrade") {
        let {x: newX, y: newY} = this.toSceneCoords(pointer.x, pointer.y);
        let curArmy = this.planet.tiles.getArmyByXY(newX, newY);
        let tileOn = this.planet.tiles.getTileByXY(newX, newY);
        let isVillage = tileOn.improvement instanceof Village;
        let isTown = tileOn.improvement instanceof Town;
        if (!isVillage && !isTown) {
          Game.getInstance().economic.mainPanel.setMessage("You can upgrade only a village or a town...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (isVillage && Game.getInstance().turn.getCurrentCountry().money < Town.cost) {
          Game.getInstance().economic.mainPanel.setMessage("Not enough money (village upgrade price is " + Town.cost + "$)...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (isTown && Game.getInstance().turn.getCurrentCountry().money < City.cost) {
          Game.getInstance().economic.mainPanel.setMessage("Not enough money (village upgrade price is " + City.cost + "$)...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Country.getCountryByTile(tileOn) !== Game.getInstance().turn.getCurrentCountry()) {
          Game.getInstance().economic.mainPanel.setMessage("You can upgrade only your localities...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (isVillage) {
          new Town().place(newX, newY, 10000, this, 'town', Game.getInstance().turn.getCurrentCountry());
          Game.getInstance().turn.getCurrentCountry().money -= Town.cost;
        }
        else if (isTown) {
          new City().place(newX, newY, 1000000, this, 'city', Game.getInstance().turn.getCurrentCountry());
          Game.getInstance().turn.getCurrentCountry().money -= City.cost;
        }
        Game.getInstance().economic.mainPanel.setInfo(this.playScene);
        Game.getInstance().economic.mainPanel.setMessage("OK");
        Game.getInstance().economic.activated = "none";
        return;
      }*/
      if (Game.getInstance().economic.activated === "ter") {
        let {x: newX, y: newY} = this.toSceneCoords(pointer.x, pointer.y);
        let curArmy = this.planet.tiles.getArmyByXY(newX, newY);
        let tileOn = this.planet.tiles.getTileByXY(newX, newY);
        if (tileOn.water && !tileOn.neighbors.find(tile => tile.improvement instanceof Locality)) {
          Game.getInstance().economic.mainPanel.setMessage("You can't buy a water territory not near to locality...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (curArmy && Country.getCountryByArmy(curArmy) !== Game.getInstance().turn.getCurrentCountry()) {
          Game.getInstance().economic.mainPanel.setMessage("You can't buy a territory where is an enemy...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Game.getInstance().turn.getCurrentCountry().money < Game.getInstance().turn.getCurrentCountry().currentTerritoryCost) {
          Game.getInstance().economic.mainPanel.setMessage("Not enough money (current territory price is " + Game.getInstance().turn.getCurrentCountry().currentTerritoryCost + "$)...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (!tileOn.neighbors.find(neighbor => Country.getCountryByTile(neighbor) === Game.getInstance().turn.getCurrentCountry())) {
          Game.getInstance().economic.mainPanel.setMessage("You can only buy a territory near to your current territories...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Country.getCountryByTile(tileOn)) {
          Game.getInstance().economic.mainPanel.setMessage("You can only buy a neutral territory...");
          Game.getInstance().economic.activated = "none";
          return;
        }
        Game.getInstance().turn.getCurrentCountry().addTile(tileOn, this);
        Game.getInstance().turn.getCurrentCountry().money -= Game.getInstance().turn.getCurrentCountry().currentTerritoryCost;
        Game.getInstance().turn.getCurrentCountry().currentTerritoryCost += 3;
        Game.getInstance().economic.mainPanel.setInfo(this.playScene);
        Game.getInstance().economic.mainPanel.setMessage("OK");
        Game.getInstance().economic.activated = "none";
        return;
      }
      if (this.planet.curArmy) {
        if (this.planet.activated !== "none") {
          //this.planet.curArmy.clearRange();
          let {x: newX1, y: newY1} = this.toSceneCoords(pointer.x, pointer.y);
          //let newX1 = this.camera.camera
          if (!this.planet.tiles.getMovementRange(this.planet.curArmy, maxMP, this.planet.activated === "shoot" || this.planet.activated === "air attack").includes(this.planet.tiles.getTileByXY(newX1, newY1)) ||
            (this.planet.curArmy.getTile() === this.planet.tiles.getTileByXY(newX1, newY1))) {
            //this.planet.cancelMovingArmy(movingArmy, prevCurArmy, this);
            this.planet.curArmy.clearRange();
            this.planet.activated = "none";
            this.planet.curArmy = null;
            return;
          }
          console.log(this.planet.curArmy);
          //let toArmy = this.planet.tiles.getArmyByXY(newX1, newY1);
          //let improvement = this.planet.tiles.getImprovementByXY(newX1, newY1);

          if (this.planet.activated === "shoot") {
            let toArmy = this.planet.tiles.getArmyByXY(newX1, newY1);
            this.planet.curArmy.clearRange();
            if (!toArmy) {
              Game.getInstance().economic.mainPanel.setMessage("No enemy on the tile");
              this.planet.activated = "none";
              this.planet.curArmy = null;
              return;
            }
            this.planet.curArmy.shoot(toArmy);
            this.planet.activated = "none";
            this.planet.curArmy = null;
            return;
          }

          if (this.planet.activated === "air attack") {
            let toArmy = this.planet.tiles.getArmyByXY(newX1, newY1);
            this.planet.curArmy.clearRange();
            if (!toArmy) {
              Game.getInstance().economic.mainPanel.setMessage("No enemy on the tile");
              this.planet.activated = "none";
              this.planet.curArmy = null;
              return;
            }
            this.planet.curArmy.airAttack(toArmy);
            this.planet.activated = "none";
            this.planet.curArmy = null;
            return;
          }

          if (this.planet.activated === "move one") {
            //movingArmy = this.planet.curArmy.pickOne(this);
            //this.planet.curArmy = movingArmy;
            this.planet.curArmy = this.planet.curArmy.pickOne(this);
          }
          //else if (this.planet.activated === "move all") {
          //  movingArmy = null;
          //}
          this.planet.curArmy.move(pointer.x, pointer.y,
            this.planet.tiles.getMovementRange(this.planet.curArmy, maxMP, this.planet.activated === "shoot" || this.planet.activated === "air attack"), this, maxMP);
          this.planet.activated = "none";
          this.planet.curArmy = null;
          console.log(Country.allArmies());
          return;
        }

        

        this.planet.activated = this.planet.curArmy.menu.click(pointer.x, pointer.y, this.camera.camera);
        if (this.planet.activated === "move all") {
          maxMP = this.planet.curArmy.getCurrentAllMovementPoints();
        }
        else if (this.planet.activated === "move one") {
          maxMP = this.planet.curArmy.getCurrentOneMovementPoints();
        }
        else if (this.planet.activated === "shoot") {
          maxMP = this.planet.curArmy.canShoot() ? this.planet.curArmy.getCurrentShootMovementPoints() : 0;
          Game.getInstance().economic.mainPanel.setMessage("Choose an enemy to shoot");
        }
        else if (this.planet.activated === "air attack") {
          maxMP = this.planet.curArmy.getCurrentAllMovementPoints();
        }
        else {
          maxMP = 0;
        }
        console.log("maxMP: " + maxMP);
        //prevCurArmy = this.planet.curArmy;
        /*if (this.planet.activated === "move one") {
          movingArmy = this.planet.curArmy.pickOne(this);
          this.planet.curArmy = movingArmy;
        }
        else if (this.planet.activated === "move all") {
          movingArmy = null;
        }*/
        /*if (movingArmy) {
          let country = Game.getInstance().turn.getCurrentCountry();
          movingArmy = country.addArmy(movingArmy!, this) as LandArmy;
          movingArmy.transferOneFromArmy(this.planet.curArmy, this, country.color);
          this.planet.curArmy.clearRange();
          this.planet.curArmy.menu.clearMenu();
          this.planet.curArmy = movingArmy;
        }*/

        if (this.planet.activated !== "none") this.planet.curArmy.renderMovementRange(this.planet.tiles.getMovementRange(this.planet.curArmy, maxMP, this.planet.activated === "shoot" || this.planet.activated === "air attack"));
        console.log(this.planet.activated);
        if (this.planet.activated === "none") {
          //this.planet.curArmy.clearRange();
          this.planet.curArmy = null;
        }
      }
      else if (!this.planet.curArmy) {
        let {x: newX, y: newY} = this.toSceneCoords(pointer.x, pointer.y);
        this.planet.chooseCurUnit(newX, newY, this);
      }
    });
  }

  update() {
    this.camera.moveHandler(this.cursors);
  }
}