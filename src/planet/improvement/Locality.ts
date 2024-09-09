import { Improvement } from "./Improvement";
import { PlanetScene } from "~/scenes/PlanetScene";
import { LandImprovement } from "./LandImprovement";
import { Country } from "../../country/Country";
import { Profitable } from "~/interfaces/Profitable";

export abstract class Locality extends LandImprovement {
    population: number;
    constructor() {
        super(); 
    }
    
    override place(x: number, y: number, population: number, planetScene: PlanetScene, name: string, country: Country) {
        super.place(x, y, population, planetScene, name, country);
        this.population = population;
    }
}