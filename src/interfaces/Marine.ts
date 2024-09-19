export const WATER = 1;
export const LAND = 2;

export interface Shippable {
    flag_shippable: boolean;
}

export function isShippable(obj: any) {
    if ("flag_shippable" in obj) {
        return true;
    }
    return false;
}