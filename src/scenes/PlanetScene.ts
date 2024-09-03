import { Scene } from "phaser";
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

export class PlanetScene extends Scene{

  planetMap!: Phaser.Tilemaps.Tilemap;
  terrainPlanet!: Phaser.Tilemaps.Tileset;
  terrainPlanetLayer!: Phaser.Tilemaps.TilemapLayer;
  planet: Planet;
  camera: Camera;
  //curUnit!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  //curUnit: PlanetUnit | null;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

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

  toSceneCoordsPixels(x: number, y: number): {x: number | null, y: number | null} {
    let phaserTile = this.terrainPlanetLayer.tilemap.getTileAt(x, y);
    return phaserTile ? {x: phaserTile.pixelX, y: phaserTile.pixelY} : {x: null, y: null};
  }

  init(data){
    this.planet = data.planet;
  }

  preload(){
  	
  }

  create(){
    new Game(new Economic(this));

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


    let prevCurArmy: LandArmy;
    let movingArmy: LandArmy | null;
    this.input.on("pointerup",  (pointer) => {
      if (this.planet.curArmy) {
        if (this.planet.activated !== "none") {
          let {x: newX1, y: newY1} = this.toSceneCoords(pointer.x, pointer.y);
          if (!this.planet.tiles.getMovementRange(this.planet.curArmy).includes(this.planet.tiles.getTileByXY(newX1, newY1)) ||
            (this.planet.curArmy.x === newX1 && this.planet.curArmy.y === newY1)) {
            console.log(200000000);
            if (movingArmy) {
              this.planet.curArmy.clearRange();
              this.planet.curArmy = prevCurArmy;
              this.planet.curArmy.addAllFromArmy(movingArmy, this, Country.getCountryByArmy(movingArmy)!.color);
              Country.removeArmy(movingArmy);
            }
            this.planet.curArmy.clearRange();
            this.planet.activated = "none";
            this.planet.curArmy = null;
            console.log(Country.allArmies());
            return;
          }
          console.log(this.planet.curArmy);
          let toArmy = this.planet.tiles.getArmyByXY(newX1, newY1);
          let improvement = this.planet.tiles.getImprovementByXY(newX1, newY1);
          this.planet.curArmy.move(pointer.x, pointer.y,
            this.planet.tiles.getMovementRange(this.planet.curArmy), this, toArmy, improvement);
          this.planet.activated = "none";
          this.planet.curArmy = null;
          console.log(Country.allArmies());
          return;
        }

        

        this.planet.activated = this.planet.curArmy.menu.click(pointer.x, pointer.y, this.planet.curArmy.getUnitsNumber(), this);
        prevCurArmy = this.planet.curArmy;
        if (this.planet.activated === "move one") {
          let singleUnitArmy = new LandArmy();
          singleUnitArmy.create(this.planet.curArmy.x, this.planet.curArmy.y);
          movingArmy = singleUnitArmy;
        }
        else if (this.planet.activated === "move all") {
          movingArmy = null;
        }
        if (movingArmy) {
          let country = Country.getCurrentCountry();
          movingArmy = country.addArmy(movingArmy!, this) as LandArmy;
          movingArmy.transferOneFromArmy(this.planet.curArmy, this, country.color);
          this.planet.curArmy.clearRange();
          this.planet.curArmy.menu.clearMenu();
          this.planet.curArmy = movingArmy;
        }
        this.planet.curArmy.renderMovementRange();
        console.log(this.planet.activated);
        if (this.planet.activated === "none") {
          this.planet.curArmy.clearRange();
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