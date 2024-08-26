
import { Unit } from "../Unit";
import { PlanetScene } from "../../scenes/PlanetScene";
import { Tiles } from "~/planet/Tiles";
import { Tile } from "~/planet/Tile";

export class PlanetUnit extends Unit {

    name: string;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    x: number;
    y: number;
    movementPoints: number;
    range: Phaser.GameObjects.Rectangle[];
    constructor() {
        super();
        this.range = [];
    }

    create(x: number, y: number, planetScene: PlanetScene) {
        this.x = x;
        this.y = y;
        this.sprite = planetScene.physics.add.sprite(64*this.x, 64*this.y, this.name).setOrigin(0, 0);
    }

    move(x: number, y: number, tiles: Tiles, range: Tile[]) {
        let {x: tmpX, y: tmpY} = this.sprite.scene.cameras.main.getWorldPoint(x, y);
        let phaserTileStart = (this.sprite.scene as PlanetScene).terrainPlanetLayer.getTileAtWorldXY(tmpX, tmpY);
        let newX = phaserTileStart.x;
        let newY = phaserTileStart.y;
        if (!range.includes(tiles.grid[newX][newY])) {
            return;
        }
        console.log(this.x, this.y);
        console.log(newX, newY);
        let shortestPath = tiles.shortestPath(
            tiles.grid[this.x][this.y],
            tiles.grid[newX][newY]
        );
        let generateSequence = function*() {
            for (let i = 1; i < shortestPath.length; i++) {
                console.log(i);
                yield shortestPath[i];
            }
            return null;
        }
        let generator = generateSequence();
        let next = generator;
        let totalCost = 0;
        console.log(shortestPath);
        let timerId = setInterval((gen) => {
                let tile: Tile | null = next.next().value;
                console.log(tile);
                if (!tile) { clearInterval(timerId); console.log(totalCost); return; }
                /*if (tile.x === 5) {
                    tile.x = 1000;
                    tile.y = 1000;
                }*/
                let phaserTile = (this.sprite.scene as PlanetScene).terrainPlanetLayer.tilemap.getTileAt(tile.x, tile.y);
                if (!phaserTile) {
                    clearInterval(timerId);
                    phaserTile = (this.sprite.scene as PlanetScene).terrainPlanetLayer.tilemap.getTileAt(
                        shortestPath[0].x, shortestPath[0].y
                    );
                    if (!phaserTile) {
                        throw new Error('Source position tile is null');
                    }
                    this.sprite.setPosition(phaserTile.pixelX, phaserTile.pixelY);
                    this.x = shortestPath[0].x;
                    this.y = shortestPath[0].y;
                    throw new Error('In-path position tile is null');
                }
                this.sprite.setPosition(phaserTile.pixelX, phaserTile.pixelY);
                this.x = tile.x;
                this.y = tile.y;
                totalCost += tile.movementCost;
            },
            250, next);
    }

    movementRange() {
        this.clearRange();
        let range = (this.sprite.scene as PlanetScene).planet.tiles.movementRange(this);
        range.forEach((tile) => {
            let phaserTile = (this.sprite.scene as PlanetScene).terrainPlanetLayer.tilemap.getTileAt(
                tile.x, tile.y
            );
            if (!phaserTile) {
                this.clearRange();
                throw new Error('Error in range building');
            }
            this.range.push(this.sprite.scene.add.rectangle(phaserTile.pixelX,phaserTile.pixelY, 64, 64, 0xff0000, 0.2).setOrigin(0,0))
        });
    }

    clearRange() {
        if (!this.range) return;
        this.range.forEach((rect) => {rect.destroy()});
        this.range = [];
    }

    // openArr is the tiles that have calculated cost
    // closedArr is the tiles that haven't calculated cost yet
    /*findPath(startTile: GraphTile, endTile: GraphTile, planetScene: PlanetScene): GraphTile[] | undefined {
        let openArr: GraphTile[] = [];
        let closedArr: GraphTile[] = [];
        let path: GraphTile[] = [];
        let curTile: GraphTile;
        openArr.push(startTile);
        while (openArr.length) {
            openArr.sort();
            curTile = openArr.shift()!;
            closedArr.push(curTile);
        
            // finally find the goal, trace path with parent
            if (curTile === endTile) {
                while (curTile !== startTile) {
                    path.push(curTile);
                    curTile = curTile.parent;
                }
                return path;
            }
        
            for (let neighbourTile of curTile.neighbours) {
                if (!neighbourNode.walkable ||
                    closedSet.contains(neighbourNode)) {
                    continue;
                }
        
                int cost = currentNode.gCost + heuristic_cost_estimate(currentNode, neighbourNode);
                if (cost < neighbour.gCost || !openSet.contains(neighbour)) {
                    neighbour.gCost = cost;
                    neighbour.hCost = heuristic_cost_estimate(neighbour, targetNode);
                    neighbour.parent = currentNode;
        
                    if (!openSet.contains(neighbour))
                    openSet.Add(neighbour);
                }
                }
            }
    
        }
        // if not found
        return null;
    }
    
    int heuristic_cost_estimate(nodeA, nodeB) {
        deltaX = abs(nodeA.x - nodeB.x);
        deltaY = abs(nodeA.y - nodeB.y);
    
        if (deltaX > deltaY)
        return 14 * deltaY + 10 * (deltaX - deltaY);
        return 14 * deltaX + 10 * (deltaY - deltaX);
    }*/
}