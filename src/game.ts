import {BootScene} from './scenes/BootScene';
import {PlayScene} from './scenes/PlayScene';
import {PlanetScene} from './scenes/PlanetScene';
import { Game } from 'phaser';

var config: Phaser.Types.Core.GameConfig = {
  width: 640,
  height: 640,
  backgroundColor: 0x000000,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { x: 0, y: 0 }
    }
  },
  scene: [BootScene, PlayScene, PlanetScene]
}


var game = new Game(config);