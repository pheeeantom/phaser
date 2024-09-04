import { Scene } from "phaser";
import { Planet } from "../planet/Planet";
import { Game } from "../game/Game";
import { Economic } from "../game/Economic";

export class PlayScene extends Scene {
  gameObj: Game;
  constructor(){
    super("playGame");
  }

  create(){
    new Game(new Economic(this));
  	this.scene.launch("planet", { 'planet': new Planet('earth') });
    this.scene.bringToTop();
  }
}