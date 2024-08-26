
import { Unit } from "../Unit";
import { PlanetScene } from "../../scenes/PlanetScene";

export class PlanetUnit extends Unit {

    name: string;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    x: number;
    y: number;
    constructor() {
        super();
    }

    create(x: number, y: number, planetScene: PlanetScene) {
        this.x = x;
        this.y = y;
        this.sprite = planetScene.physics.add.sprite(64*this.x, 64*this.y, this.name).setOrigin(0, 0);
    }
}