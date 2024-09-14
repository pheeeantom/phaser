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
    this.input.on("pointerdown",  (pointer) => {
      Game.getInstance().economic.mainPanel.activate(pointer.x, pointer.y);
    });
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
        Game.getInstance().economic.mainPanel.setMessage("Place a soldier...");
      }
      else if (action === "artillery") {
        Game.getInstance().economic.activated = "artillery";
        Game.getInstance().economic.mainPanel.setMessage("Place an artillery...");
      }
      else if (action === "tank") {
        Game.getInstance().economic.activated = "tank";
        Game.getInstance().economic.mainPanel.setMessage("Place a tank...");
      }
      else if (action === "village") {
        Game.getInstance().economic.activated = "village";
        Game.getInstance().economic.mainPanel.setMessage("Place a village...");
      }
      else if (action === "farm") {
        Game.getInstance().economic.activated = "farm";
        Game.getInstance().economic.mainPanel.setMessage("Place a farm...");
      }
      else if (action === "mine") {
        Game.getInstance().economic.activated = "mine";
        Game.getInstance().economic.mainPanel.setMessage("Place a mine...");
      }
      else if (action === "upgrade") {
        Game.getInstance().economic.activated = "upgrade";
        Game.getInstance().economic.mainPanel.setMessage("Upgrade a village or a town...");
      }
      else if (action === "buy ter") {
        Game.getInstance().economic.activated = "ter";
        Game.getInstance().economic.mainPanel.setMessage("Buy a neighbor territory...");
      }
      if (action !== "none") {
        Game.getInstance().economic.menuClicked = true;
      }
      Game.getInstance().economic.mainPanel.setInfo(this);
    });
  }
}