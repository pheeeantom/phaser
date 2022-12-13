class PlayScene extends Phaser.Scene{
  constructor(){
    super("playGame");
  }

  create(){
  	this.scene.start("earth");
  }
}