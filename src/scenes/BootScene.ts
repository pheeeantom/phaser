import { Scene } from "phaser";

export class BootScene extends Scene {
  constructor() {
    super("bootGame");
  }

  preload(){
    this.load.json("localities_names", "./assets/names/localities.json");
    this.load.image("earth_terrain_img", "./assets/tilesets/earth_terrain.png");
    this.load.tilemapTiledJSON("earth", "./assets/tilemaps/earth.json");
    this.load.spritesheet('soldier', './assets/units/planet/martial/land/soldier.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('tank', './assets/units/planet/martial/land/tank.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('artillery', './assets/units/planet/martial/land/artillery.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('aircraft', './assets/units/planet/martial/air/aircraft.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('ship', './assets/units/planet/martial/marine/ship.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    this.scene.start("playGame");
  }
}