import { PlanetScene } from "~/scenes/PlanetScene";

export class Camera {
    camera: Phaser.Cameras.Scene2D.Camera;
    constructor(camera: Phaser.Cameras.Scene2D.Camera) {
        this.camera = camera;
    }

    moveHandler(cursors) {
        //this.curUnit.body.setVelocity(0);
        // Horizontal movement
        if (cursors.left.isDown) {
            /*if (this.cameras.main.scrollX ) */this.camera.scrollX -= 8 / this.camera.zoom;
        }
        else if (cursors.right.isDown) {
            this.camera.scrollX += 8 / this.camera.zoom;
        }
        // Vertical movement
        if (cursors.up.isDown) {
            this.camera.scrollY -= 8 / this.camera.zoom;
        }
        else if (cursors.down.isDown) {
            this.camera.scrollY += 8 / this.camera.zoom;
        }
    }

    zoomHandler(deltaY) {
        //console.log(Math.min(this.planet.widthInPixels, this.planet.heightInPixels));

        if (deltaY > 0) {
            var newZoom = this.camera.zoom -.04;
            //console.log(newZoom);
            if (Math.min(this.camera.getBounds().width, this.camera.getBounds().height) >=
            Math.min((this.camera.scene as PlanetScene).planetMap.widthInPixels,
                (this.camera.scene as PlanetScene).planetMap.heightInPixels) / newZoom) {
            this.camera.zoom = newZoom;     
            }
        }
        
        if (deltaY < 0) {
            var newZoom = this.camera.zoom +.04;
            if (Math.min((this.camera.scene as PlanetScene).planetMap.widthInPixels,
                (this.camera.scene as PlanetScene).planetMap.heightInPixels) / (64 * newZoom) >= 5) {
            this.camera.zoom = newZoom;
            }
        }
    }
}