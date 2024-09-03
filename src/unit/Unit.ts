export abstract class Unit {
    name: string;
    meleeAttackDice: string;
    constructor() {
        
    }

    diceRoll(diceRolls: string): number {
        let [numStr, diceStr] = diceRolls.split("d");
        let num = Number(numStr);
        let dice = Number(diceStr);
        let values: number[] = [];
        for (let i = 0; i < num; i++) {
            values.push(Math.floor(Math.random() * dice + 1));
        }
        console.log(values);
        return Math.max(...values);
    }
}