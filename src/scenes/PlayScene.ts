import { Scene } from "phaser";
import { Planet } from "../planet/Planet";
import { Game } from "../game/Game";

export class PlayScene extends Scene {
  gameObj: Game;
  constructor(){
    super("playGame");
    this.gameObj = new Game();
  }

  create(){
  	this.scene.start("planet", { 'planet': new Planet('earth'), 'game': this.gameObj });
  }
}