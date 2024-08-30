import { Scene } from "phaser";
import { Planet } from "../planet/Planet";
import { Game } from "../game/Game";
import { PlanetUnit } from "../unit/planet/PlanetUnit";
import { Country } from "../country/Country";
import { Camera } from "../game/Camera";
import { LandArmy } from "~/country/LandArmy";
import { Army } from "~/country/Army";

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

    this.input.on("pointerup",  (pointer) => {
      if (this.planet.curArmy) {
        if (this.planet.activated !== "none") {
          if (this.planet.activated === "move one") {
            this.planet.chooseOne(this.planet.curArmy.x, this.planet.curArmy.y);
          }
          else if (this.planet.activated === "move all") {
            this.planet.chooseAll();
          }
          if (this.planet.tmpArmy) {
            let country = Country.getCurrentCountry();
            country.addArmy(this.planet.tmpArmy!, [this.planet.curArmy.units[0]], this);
            this.planet.curArmy.removeUnit(this.planet.tmpArmy!.units, this, country.color);
            this.planet.curArmy.clearRange();
            this.planet.curArmy.menu.clearMenu();
            this.planet.curArmy = this.planet.tmpArmy! as LandArmy;
          }
          console.log(this.planet.curArmy);
          this.planet.curArmy.move(pointer.x, pointer.y,
            this.planet.tiles.movementRange(this.planet.curArmy), () => {
              if (this.planet.curArmy) {
                console.log(10000000);
                this.planet.curArmy.clearRange();
                let improvement = Planet.getImprovementByXY(this.planet.curArmy.x, this.planet.curArmy.y);
                console.log(improvement);
                if (improvement) {
                  let country = Country.getCurrentCountry();
                  improvement.occupy(country, this);
                }
                console.log(this.planet.curArmy);
                let country = Country.getCountryByArmy(this.planet.curArmy);
                if (!country) throw new Error('Army is not in any country');
                this.planet.curArmy.renderLabel(this, country.color);
                this.planet.curArmy.menu.clearMenu();
                this.planet.activated = "none";
                this.planet.curArmy = null;
              }
            });
          return;
        }
        this.planet.activated = this.planet.curArmy.menu.click(pointer.x, pointer.y, this.planet.curArmy.x, this.planet.curArmy.y,
          this.planet.curArmy.units.length);
        console.log(this.planet.activated);
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