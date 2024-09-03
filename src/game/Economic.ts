import { Scene } from "phaser";
import { EconomicPanel } from "./EconomicPanel";

export class Economic {
    mainPanel: EconomicPanel;
    constructor(scene: Scene) {
        this.mainPanel = new EconomicPanel(scene);
    }
}