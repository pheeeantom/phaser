export class Turn {
    num: number;
    country: string;
    countries: string[];
    constructor(countries: string[]) {
        this.countries = countries;
        this.country = countries[0];
        this.num = 0;
    }

    endTurn() {
        let index = this.countries.indexOf(this.country);
        if (index === this.countries.length - 1) {
            this.country = this.countries[0];
            this.num++;
        }
        else {
            this.country = this.countries[index + 1];
        }
    }
}