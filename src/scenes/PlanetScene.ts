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
    Game.getInstance().turn.getCurrentCountry().income();
    Game.getInstance().economic.mainPanel.setInfo(this.playScene);


    //let prevCurArmy: LandArmy;
    //let movingArmy: LandArmy | null;
    let maxMP: number = 0;
    this.input.on("pointerup",  (pointer) => {
      if (Game.getInstance().economic.menuClicked) {
        Game.getInstance().economic.menuClicked = false;
        return;
      }
      console.log(Game.getInstance().economic.activated);
      if (Game.getInstance().economic.activated === "soldier") {
        let {x: newX, y: newY} = this.toSceneCoords(pointer.x, pointer.y);
        let curArmy = this.planet.tiles.getArmyByXY(newX, newY);
        let tileOn = this.planet.tiles.getTileByXY(newX, newY);
        if (curArmy && (curArmy.getUnitsType() !== "soldier" || curArmy.getUnitsNumber() + 1 > curArmy.getUnitsMaxNum() ||
          Country.getCountryByArmy(curArmy) !== Game.getInstance().turn.getCurrentCountry())) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Game.getInstance().turn.getCurrentCountry().money < Soldier.cost) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Country.getCountryByTile(tileOn) !== Game.getInstance().turn.getCurrentCountry()) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        tileOn.spawnUnit(this, Game.getInstance().turn.getCurrentCountry());
        Game.getInstance().turn.getCurrentCountry().money -= Soldier.cost;
        Game.getInstance().economic.mainPanel.setInfo(this.playScene);
        Game.getInstance().economic.activated = "none";
        return;
      }
      if (Game.getInstance().economic.activated === "village") {
        let {x: newX, y: newY} = this.toSceneCoords(pointer.x, pointer.y);
        let curArmy = this.planet.tiles.getArmyByXY(newX, newY);
        let tileOn = this.planet.tiles.getTileByXY(newX, newY);
        if (Game.getInstance().turn.getCurrentCountry().money < Village.cost) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Country.getCountryByTile(tileOn) !== Game.getInstance().turn.getCurrentCountry()) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (tileOn.improvement) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (tileOn.terrainTypeId !== 2 && tileOn.terrainTypeId !== 4) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        new Village().place(newX, newY, 1000, this, 'village', Game.getInstance().turn.getCurrentCountry());
        Game.getInstance().turn.getCurrentCountry().money -= Village.cost;
        Game.getInstance().economic.mainPanel.setInfo(this.playScene);
        Game.getInstance().economic.activated = "none";
        return;
      }
      if (Game.getInstance().economic.activated === "ter") {
        let {x: newX, y: newY} = this.toSceneCoords(pointer.x, pointer.y);
        let curArmy = this.planet.tiles.getArmyByXY(newX, newY);
        let tileOn = this.planet.tiles.getTileByXY(newX, newY);
        if (curArmy && Country.getCountryByArmy(curArmy) !== Game.getInstance().turn.getCurrentCountry()) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (Game.getInstance().turn.getCurrentCountry().money < 3) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        if (!tileOn.neighbors.find(neighbor => Country.getCountryByTile(neighbor) === Game.getInstance().turn.getCurrentCountry())) {
          Game.getInstance().economic.activated = "none";
          return;
        }
        Game.getInstance().turn.getCurrentCountry().addTile(tileOn, this);
        Game.getInstance().turn.getCurrentCountry().money -= 3;
        Game.getInstance().economic.mainPanel.setInfo(this.playScene);
        Game.getInstance().economic.activated = "none";
        return;
      }
      if (this.planet.curArmy) {
        if (this.planet.activated !== "none") {
          //this.planet.curArmy.clearRange();
          let {x: newX1, y: newY1} = this.toSceneCoords(pointer.x, pointer.y);
          //let newX1 = this.camera.camera
          if (!this.planet.tiles.getMovementRange(this.planet.curArmy, maxMP).includes(this.planet.tiles.getTileByXY(newX1, newY1)) ||
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
          if (this.planet.activated === "move one") {
            //movingArmy = this.planet.curArmy.pickOne(this);
            //this.planet.curArmy = movingArmy;
            this.planet.curArmy = this.planet.curArmy.pickOne(this);
          }
          //else if (this.planet.activated === "move all") {
          //  movingArmy = null;
          //}
          this.planet.curArmy.move(pointer.x, pointer.y,
            this.planet.tiles.getMovementRange(this.planet.curArmy, maxMP), this, maxMP);
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

        if (this.planet.activated !== "none") this.planet.curArmy.renderMovementRange(this.planet.tiles.getMovementRange(this.planet.curArmy, maxMP));
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