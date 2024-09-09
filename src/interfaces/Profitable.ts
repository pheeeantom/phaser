export interface Profitable {
    income(): number;
}

export function isProfitable(obj: any) {
    if ("income" in obj) {
        return true;
    }
    return false;
}