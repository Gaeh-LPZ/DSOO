export class Customer {
    constructor(
        public id: string,
        public name: string,
        public email: string | null,
    ) { }

    updateName(newName: string): void {
        if (newName.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres");
        }
        this.name = newName.trim();
    }
}