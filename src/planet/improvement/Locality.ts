import { Improvement } from "./Improvement";
import { PlanetScene } from "~/scenes/PlanetScene";
import { LandImprovement } from "./LandImprovement";

export abstract class Locality extends LandImprovement {
    population: number;
    constructor() {
        super(); 
    }
    
    override place(x: number, y: number, population: number, planetScene: PlanetScene, name: string) {
        super.place(x, y, population, planetScene, name);
        this.population = population;
    }
}