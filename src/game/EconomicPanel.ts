import { Scene } from "phaser";
import { PlanetScene } from "~/scenes/PlanetScene";
import { Game } from "./Game";

export class EconomicPanel {
    private _buildUnit: Phaser.GameObjects.Text;
    private _subBuildUnit: Phaser.GameObjects.Text | null;
    private _buildHouse: Phaser.GameObjects.Text;
    private _subBuildHouse: Phaser.GameObjects.Text | null;
    private _mainMenu: Phaser.GameObjects.Text;
    private _buyTerritory: Phaser.GameObjects.Text;
    private _info: Phaser.GameObjects.Text;
    private _message: Phaser.GameObjects.Text;
    static readonly unitsToBuy = ["Soldier", "Artillery", "Tank", "AirCraft", "Destroyer", "BattleShip"];
    static readonly buildingsToBuy = ["Upgrade", "Village", "Farm", "Mine", "Factory"];
    constructor(scene: Scene) {
        this._buildUnit = scene.add.text(0, 0, "Build unit⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._buildHouse = scene.add.text(0, 0, "Build house⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._mainMenu = scene.add.text(0, 0, /*"Build⯆"*/"End turn...", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._buyTerritory = scene.add.text(0, 0, "Buy ter", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        //this.mainMenu.setScrollFactor(0, 0);
        this._message = scene.add.text(0, 0, "", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
    }

    toggleBuildUnit(scene: Scene) {
        if (this._subBuildUnit) {
            this._subBuildUnit.destroy();
            this._subBuildUnit = null;
            return;
        }
        this._subBuildUnit = scene.add.text(0, this._mainMenu.y + this._mainMenu.height + this._buildUnit.height, EconomicPanel.unitsToBuy.join("\n"), {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        if (this._subBuildHouse) {
            this._subBuildHouse.destroy();
            this._subBuildHouse = null;
        }
    }

    toggleBuildHouse(scene: Scene) {
        if (this._subBuildHouse) {
            this._subBuildHouse.destroy();
            this._subBuildHouse = null;
            return;
        }
        this._subBuildHouse = scene.add.text(this._buildUnit.x + this._buildUnit.width, this._mainMenu.y + this._mainMenu.height + this._buildHouse.height, EconomicPanel.buildingsToBuy.join("\n"), {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        if (this._subBuildUnit) {
            this._subBuildUnit.destroy();
            this._subBuildUnit = null;
        }
    }

    activate(x: number, y: number) {
        /*let menuLeftX = this._mainMenu.x;
        let menuTopY = this._mainMenu.y;
        let menuRightX = this._mainMenu.x + this._mainMenu.width;
        let menuBottomY = this._mainMenu.y + this._mainMenu.height;*/
        if (x > this._mainMenu.x && x < this._mainMenu.x + this._mainMenu.width &&
            y > this._mainMenu.y && y < this._mainMenu.y + this._mainMenu.height) {
            this._mainMenu.setText("**" + this._mainMenu.text);
        }
        if (x > this._buildUnit.x && x < this._buildUnit.x + this._buildUnit.width &&
            y > this._buildUnit.y && y < this._buildUnit.y + this._buildUnit.height) {
            //console.log("aaaaaaaaaa");
            //return "build unit";
            this._buildUnit.setText("**" + this._buildUnit.text);
        }
        if (x > this._buildHouse.x && x < this._buildHouse.x + this._buildHouse.width &&
            y > this._buildHouse.y && y < this._buildHouse.y + this._buildHouse.height) {
            //return "build house";
            this._buildHouse.setText("**" + this._buildHouse.text);
        }
        if (this._subBuildUnit) {
            let newTextArr = this._subBuildUnit.text.split("\n");
            let numOpts = newTextArr.length;
            for (let i = 0; i < numOpts; i++) {
                if (x > this._subBuildUnit.x && x < this._subBuildUnit.x + this._subBuildUnit.width &&
                    y > this._subBuildUnit.y + i * (this._subBuildUnit.height / numOpts) &&
                    y < this._subBuildUnit.y + (i + 1) * (this._subBuildUnit.height / numOpts)) {
                    newTextArr[i] = "**" + newTextArr[i];
                }
            }
            this._subBuildUnit.setText(newTextArr.join("\n"));
        }
        /*if (x > this._subBuildUnit.x && x < this._subBuildUnit.x + this._subBuildUnit.width &&
            y > this._subBuildUnit.y + 0 * this._subBuildUnit.height / numOpts &&
            y < this._subBuildUnit.y + 1 * this._subBuildUnit.height / numOpts) {
            //return "soldier";
            newTextArr[0] = "**" + newTextArr[0];
            
        }
        if (x > this._subBuildUnit.x && x < this._subBuildUnit.x + this._subBuildUnit.width &&
            y > this._subBuildUnit.y + 1 * this._subBuildUnit.height / numOpts &&
            y < this._subBuildUnit.y + 2 * this._subBuildUnit.height / numOpts) {
            //return "soldier";
            newTextArr[1] = "**" + newTextArr[1];
        }
        if (x > this._subBuildUnit.x && x < this._subBuildUnit.x + this._subBuildUnit.width &&
            y > this._subBuildUnit.y + 2 * this._subBuildUnit.height / numOpts &&
            y < this._subBuildUnit.y + 3 * this._subBuildUnit.height / numOpts) {
            //return "soldier";
            newTextArr[2] = "**" + newTextArr[2];
        }
        if (x > this._subBuildUnit.x && x < this._subBuildUnit.x + this._subBuildUnit.width &&
            y > this._subBuildUnit.y + 3 * this._subBuildUnit.height / numOpts &&
            y < this._subBuildUnit.y + 4 * this._subBuildUnit.height / numOpts) {
            //return "soldier";
            newTextArr[3] = "**" + newTextArr[3];
        }*/
        if (this._subBuildHouse) {
            let newTextArr = this._subBuildHouse.text.split("\n");
            let numOpts = newTextArr.length;
            for (let i = 0; i < numOpts; i++) {
                if (x > this._subBuildHouse.x && x < this._subBuildHouse.x + this._subBuildHouse.width &&
                    y > this._subBuildHouse.y + i * (this._subBuildHouse.height / numOpts) &&
                    y < this._subBuildHouse.y + (i + 1) * (this._subBuildHouse.height / numOpts)) {
                    newTextArr[i] = "**" + newTextArr[i];
                }
            }
            this._subBuildHouse.setText(newTextArr.join("\n"));
        }
        /*
        let newTextArr = this._subBuildHouse.text.split("\n");
        if (x > this._subBuildHouse.x && x < this._subBuildHouse.x + this._subBuildHouse.width &&
            y > this._subBuildHouse.y + 0 * this._subBuildHouse.height / 4 &&
            y < this._subBuildHouse.y + 1 * this._subBuildHouse.height / 4) {
            //return "upgrade";
            newTextArr[0] = "**" + newTextArr[0];
        }
        if (x > this._subBuildHouse.x && x < this._subBuildHouse.x + this._subBuildHouse.width &&
            y > this._subBuildHouse.y + 1 * this._subBuildHouse.height / 4 &&
            y < this._subBuildHouse.y + 2 * this._subBuildHouse.height / 4) {
            //return "village";
            newTextArr[1] = "**" + newTextArr[1];
        }
        if (x > this._subBuildHouse.x && x < this._subBuildHouse.x + this._subBuildHouse.width &&
            y > this._subBuildHouse.y + 2 * this._subBuildHouse.height / 4 &&
            y < this._subBuildHouse.y + 3 * this._subBuildHouse.height / 4) {
            //return "farm";
            newTextArr[2] = "**" + newTextArr[2];
        }
        if (x > this._subBuildHouse.x && x < this._subBuildHouse.x + this._subBuildHouse.width &&
            y > this._subBuildHouse.y + 3 * this._subBuildHouse.height / 4 &&
            y < this._subBuildHouse.y + 4 * this._subBuildHouse.height / 4) {
            //return "mine";
            newTextArr[3] = "**" + newTextArr[3];
        }
        this._subBuildHouse.setText(newTextArr.join("\n"));
        */
        if (x > this._buyTerritory.x && x < this._buyTerritory.x + this._buyTerritory.width &&
            y > this._buyTerritory.y && y < this._buyTerritory.y + this._buyTerritory.height) {
            //return "buy ter";
            this._buyTerritory.setText("**" + this._buyTerritory.text);
        }
        this.updateInfo(this._mainMenu.scene);
        //return "none";
    }

    click(x: number, y: number) {
        /*let menuLeftX = this._mainMenu.x;
        let menuTopY = this._mainMenu.y;
        let menuRightX = this._mainMenu.x + this._mainMenu.width;
        let menuBottomY = this._mainMenu.y + this._mainMenu.height;*/
        if (x > this._mainMenu.x && x < this._mainMenu.x + this._mainMenu.width &&
            y > this._mainMenu.y && y < this._mainMenu.y + this._mainMenu.height) {
            return "end turn";
        }
        if (x > this._buildUnit.x && x < this._buildUnit.x + this._buildUnit.width &&
            y > this._buildUnit.y && y < this._buildUnit.y + this._buildUnit.height) {
            //console.log("aaaaaaaaaa");
            return "build unit";
        }
        if (x > this._buildHouse.x && x < this._buildHouse.x + this._buildHouse.width &&
            y > this._buildHouse.y && y < this._buildHouse.y + this._buildHouse.height) {
            return "build house";
        }
        if (this._subBuildUnit) {
            let numOpts = this._subBuildUnit.text.split("\n").length;
            for (let i = 0; i < numOpts; i++) {
                if (x > this._subBuildUnit.x && x < this._subBuildUnit.x + this._subBuildUnit.width &&
                    y > this._subBuildUnit.y + i * (this._subBuildUnit.height / numOpts) &&
                    y < this._subBuildUnit.y + (i + 1) * (this._subBuildUnit.height / numOpts)) {
                    console.log(EconomicPanel.unitsToBuy[i].toLowerCase());
                    return EconomicPanel.unitsToBuy[i].toLowerCase();
                }
            }
        }
        if (this._subBuildHouse) {
            let numOpts = this._subBuildHouse.text.split("\n").length;
            for (let i = 0; i < numOpts; i++) {
                if (x > this._subBuildHouse.x && x < this._subBuildHouse.x + this._subBuildHouse.width &&
                    y > this._subBuildHouse.y + i * (this._subBuildHouse.height / numOpts) &&
                    y < this._subBuildHouse.y + (i + 1) * (this._subBuildHouse.height / numOpts)) {
                    return EconomicPanel.buildingsToBuy[i].toLowerCase();
                }
            }
        }
        if (x > this._buyTerritory.x && x < this._buyTerritory.x + this._buyTerritory.width &&
            y > this._buyTerritory.y && y < this._buyTerritory.y + this._buyTerritory.height) {
            return "buy ter";
        }
        return "none";
    }

    updateInfo(scene: Scene) {
        this._buildUnit.destroy();
        this._buildHouse.destroy();
        this._mainMenu.destroy();
        this._buyTerritory.destroy();
        this._buildUnit = scene.add.text(0, 0, this._buildUnit.text, {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._buildHouse = scene.add.text(0, 0, this._buildHouse.text, {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._mainMenu = scene.add.text(0, 0, /*"Build⯆"*/this._mainMenu.text, {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._buyTerritory = scene.add.text(0, 0, this._buyTerritory.text, {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._info = scene.add.text(0, 0, this._info.text, this._info.style);
        this._buildUnit.setY(this._mainMenu.height);
        this._buildHouse.setY(this._mainMenu.height);
        this._buyTerritory.setY(this._mainMenu.height);
        this._buildHouse.setX(this._buildUnit.width);
        this._buyTerritory.setX(this._buildUnit.width + this._buildHouse.width);
        this._mainMenu.setX(this._info.width);
    }

    setInfo(scene: Scene) {
        this._buildUnit.destroy();
        this._buildHouse.destroy();
        this._mainMenu.destroy();
        this._buyTerritory.destroy();
        this._buildUnit = scene.add.text(0, 0, "Build unit⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._buildHouse = scene.add.text(0, 0, "Build house⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._mainMenu = scene.add.text(0, 0, /*"Build⯆"*/"End turn...", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._buyTerritory = scene.add.text(0, 0, "Buy ter", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this._info = scene.add.text(0, 0,
            Game.getInstance().turn.getCurrentCountry().name + ", turn: " + String(Game.getInstance().turn.getCurrentTurn()) +
            ", " + Game.getInstance().turn.getCurrentCountry().money + "$ ",
            {backgroundColor: "#888888", color: Game.getInstance().turn.getCurrentCountry().color, fontSize: "20px"});
        if (this._subBuildUnit) {
            this._subBuildUnit.destroy();
            this._subBuildUnit = null;
            this._subBuildUnit = scene.add.text(0, this._mainMenu.y + this._mainMenu.height + this._buildUnit.height, EconomicPanel.unitsToBuy.join("\n"), {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        }
        if (this._subBuildHouse) {
            this._subBuildHouse.destroy();
            this._subBuildHouse = null;
            this._subBuildHouse = scene.add.text(this._buildUnit.x + this._buildUnit.width, this._mainMenu.y + this._mainMenu.height + this._buildHouse.height, EconomicPanel.buildingsToBuy.join("\n"), {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        }
        this._buildUnit.setY(this._mainMenu.height);
        this._buildHouse.setY(this._mainMenu.height);
        this._buyTerritory.setY(this._mainMenu.height);
        this._buildHouse.setX(this._buildUnit.width);
        this._buyTerritory.setX(this._buildUnit.width + this._buildHouse.width);
        this._mainMenu.setX(this._info.width);
    }

    setMessage(message: string) {
        this._message.setY(this._message.scene.sys.game.scale.gameSize.height - this._message.height);
        this._message.setText(message);
    }

    /*render(scene: Scene) {
        this.mainMenu.destroy();
        let {x: newX, y: newY} = (scene as PlanetScene).camera.camera.getWorldPoint(0, 0);
        this.mainMenu = scene.add.text(newX, newY, "Build⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
    }*/

    /*update(scene: Scene) {
        this.mainMenu.destroy();
        this.mainMenu = scene.add.text(0, 0, "Build⯆", {backgroundColor: "#888888", color: "#000000", fontSize: "20px"});
        this.mainMenu.setScrollFactor(0, 0);
        this.mainMenu.scale = 1;
    }*/
}