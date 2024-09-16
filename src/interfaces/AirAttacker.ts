export interface AirAttacker {
    airAttackDice: string;
}

export function isAirAttacker(obj: any) {
    if ("airAttackDice" in obj) {
        return true;
    }
    return false;
}