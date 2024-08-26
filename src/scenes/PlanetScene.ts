import { Scene } from "phaser";
import { Planet } from "../planet/Planet";
import { Game } from "../game/Game";
import { PlanetUnit } from "../unit/planet/PlanetUnit";

export class PlanetScene extends Scene{

  planetMap!: Phaser.Tilemaps.Tilemap;
  terrainPlanet!: Phaser.Tilemaps.Tileset;
  terrainPlanetLayer!: Phaser.Tilemaps.TilemapLayer;
  planet: Planet;
  gameObj: Game;
  //curUnit!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  //curUnit: PlanetUnit | null;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(){
    super("planet");
    //this.curUnit = null;
  }

  init(data){
    this.planet = data.planet;
    this.gameObj = data.game;
  }

  preload(){
  	
  }

  create(){
  	this.planetMap = this.add.tilemap(this.planet.name);

    this.terrainPlanet = this.planetMap.addTilesetImage(this.planet.name + "_terrain", this.planet.name + "_terrain_img")!;

    this.terrainPlanetLayer = this.planetMap.createLayer("terrain", [this.terrainPlanet], 0, 0)!.setDepth(-1);
    console.log(this.terrainPlanetLayer);

    //this.curUnit = this.physics.add.sprite(64*7, 64*3, 'soldier').setOrigin(0, 0);

    //this.physics.world.bounds.width = this.planetMap.widthInPixels;
    //this.physics.world.bounds.height = this.planetMap.heightInPixels;
    //this.curUnit.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.cameras.main.setBounds(-64, -64, this.planetMap.widthInPixels + 128, this.planetMap.heightInPixels + 128);
    this.cameras.main.roundPixels = true;

    this.input.on("wheel",  (pointer, gameObjects, deltaX, deltaY, deltaZ) => {

      //console.log(Math.min(this.planet.widthInPixels, this.planet.heightInPixels));

      if (deltaY > 0) {
        var newZoom = this.cameras.main.zoom -.04;
        console.log(newZoom);
        if (Math.min(this.cameras.main.getBounds().width, this.cameras.main.getBounds().height) >=
          Math.min(this.planetMap.widthInPixels, this.planetMap.heightInPixels) / newZoom) {
          this.cameras.main.zoom = newZoom;     
        }
      }
    
      if (deltaY < 0) {
        var newZoom = this.cameras.main.zoom +.04;
        if (Math.min(this.planetMap.widthInPixels, this.planetMap.heightInPixels) / (64 * newZoom) >= 5) {
          this.cameras.main.zoom = newZoom;
        }
      }
    });

    this.planet.tiles.generateTiles(this);
                                  this.planet.initTmp(this, this.gameObj);

    this.input.on("pointerup",  (pointer) => {
      if (this.planet.curUnit) {
        this.planet.curUnit.move(pointer.x, pointer.y, this.planet.tiles, this.planet.tiles.movementRange(this.planet.curUnit));
        this.planet.curUnit.clearRange();
        this.planet.curUnit = null;
      }
      else if (!this.planet.curUnit) {
        if (!this.gameObj.countries.get(this.gameObj.turn.country)) {
          throw new Error('No current country');
        }
        else {
          this.planet.curUnit = this.gameObj.countries.get(this.gameObj.turn.country)!.units.filter(
            (unit) => unit instanceof PlanetUnit
          ).find((unit) => {
            let {x: tmpX, y: tmpY} = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            let phaserTileStart = this.terrainPlanetLayer.getTileAtWorldXY(tmpX, tmpY);
            let newX = phaserTileStart.x;
            let newY = phaserTileStart.y;
            return unit.x === newX && unit.y === newY;
          }) ?? null;
          this.planet.curUnit?.movementRange();
        }
      }
      console.log(this.planet.curUnit);
    });
  }

  update() {
    //this.curUnit.body.setVelocity(0);
    // Horizontal movement
    if (this.cursors.left.isDown) {
      /*if (this.cameras.main.scrollX ) */this.cameras.main.scrollX -= 8 / this.cameras.main.zoom;
    }
    else if (this.cursors.right.isDown) {
      this.cameras.main.scrollX += 8 / this.cameras.main.zoom;
    }
    // Vertical movement
    if (this.cursors.up.isDown) {
      this.cameras.main.scrollY -= 8 / this.cameras.main.zoom;
    }
    else if (this.cursors.down.isDown) {
      this.cameras.main.scrollY += 8 / this.cameras.main.zoom;
    }
  }
}