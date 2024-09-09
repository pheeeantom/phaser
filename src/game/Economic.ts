import { Scene } from "phaser";
import { EconomicPanel } from "./EconomicPanel";

export class Economic {
    mainPanel: EconomicPanel;
    activated: string;
    menuClicked: boolean;
    constructor(scene: Scene) {
        this.mainPanel = new EconomicPanel(scene);
    }
}