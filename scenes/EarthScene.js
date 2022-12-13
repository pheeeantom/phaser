class EarthScene extends Phaser.Scene{
  constructor(){
    super("earth");
  }

  preload(){
  	this.load.image("earth_terrain_img", "./assets/tilesets/earth_terrain.png");

    this.load.tilemapTiledJSON("earth", "./assets/tilemaps/earth.json");
  }

  create(){
  	this.earth = this.add.tilemap("earth");

    this.terrainEarth = this.earth.addTilesetImage("earth_terrain", "earth_terrain_img");

    this.terrainEarthLayer = this.earth.createLayer("terrain", [this.terrainEarth], 0, 0).setDepth(-1);
  }
}