class BootScene extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }

  preload(){
    
  }

  create() {
    this.scene.start("playGame");
  }
}