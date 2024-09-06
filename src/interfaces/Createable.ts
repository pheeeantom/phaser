import { Space } from '../space/Space';
import { Planet } from '../planet/planet';

export interface Createable<T> {
    create(x: number, y: number, place?: unknown): T;
    remove(): void;
}

export interface CreateablePlanet<T> extends Createable<T> {
    create(x: number, y: number, planet: Planet): T;
}

export interface CreateableSpace<T> extends Createable<T> {
    create(x: number, y: number, space: Space): T;
}