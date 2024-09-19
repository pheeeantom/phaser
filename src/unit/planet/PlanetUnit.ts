
import { Unit } from "../Unit";
import { PlanetScene } from "../../scenes/PlanetScene";
import { Tile } from "~/planet/Tile";

export abstract class PlanetUnit extends Unit {
    movementPoints: number;
    currentMovementPoints: number;
    maxNum: number;
    landWater: number;
    static readonly cost: number;
    constructor() {
        super();
    }

    restoreCurrentMovementPoints() {
        this.currentMovementPoints = this.movementPoints;
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