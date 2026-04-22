export class Supplier {
    constructor(
        public id: string,
        public name: string
    ){}

    getName(): string {
        return this.name
    }
}