import { Scene } from "phaser";
import { Planet } from "../planet/Planet";

export class PlayScene extends Scene {
  constructor(){
    super("playGame");
  }

  create(){
  	this.scene.start("planet", { 'planet': new Planet('earth') });
  }
}