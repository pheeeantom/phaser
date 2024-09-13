export interface RangedAttacker {
    range: number;
    rangedAttackDice: string;
}

export function isRangedAttacker(obj: any) {
    if ("range" in obj && "rangedAttackDice" in obj) {
        return true;
    }
    return false;
}