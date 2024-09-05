import { Scene } from "phaser";

export class WinScene extends Scene {
    text: string;
    color: string;
    constructor(){
        super("win");
    }

    init(data){
        this.text = data.text;
        this.color = data.color;
    }

    create() {
        this.add.text(0, 0, this.text, {color: this.color, fontSize: "50px"});
    }
}