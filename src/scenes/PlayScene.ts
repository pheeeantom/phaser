import { Scene } from "phaser";
import { Planet } from "../planet/Planet";
import { Game } from "../game/Game";
import { Economic } from "../game/Economic";
import { PlanetScene } from "./PlanetScene";

export class PlayScene extends Scene {
  gameObj: Game;
  constructor(){
    super("playGame");
  }

  create(){
    new Game(new Economic(this));
  	let planetScenePlugin = this.scene.launch("planet", { 'planet': new Planet('earth'), 'playscene': this });
    this.scene.bringToTop();
    this.input.on("pointerup",  (pointer) => {
      let action = Game.getInstance().economic.mainPanel.click(pointer.x, pointer.y);
      if (action === "end turn") {
        Game.getInstance().turn.endTurn(planetScenePlugin.get("planet") as PlanetScene, this);
      }
      else if (action === "build unit") {
        Game.getInstance().economic.mainPanel.toggleBuildUnit(this);
      }
      else if (action === "build house") {
        Game.getInstance().economic.mainPanel.toggleBuildHouse(this);
      }
      else if (action === "soldier") {
        Game.getInstance().economic.activated = "soldier";
      }
      else if (action === "village") {
        Game.getInstance().economic.activated = "village";
      }
      else if (action === "buy ter") {
        Game.getInstance().economic.activated = "ter";
      }
      if (action !== "none") {
        Game.getInstance().economic.menuClicked = true;
      }
    });
  }
}