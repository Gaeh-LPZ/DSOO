import { HashService } from "@/infrastructure/security/has.service";

export class Customer {
    constructor(
        public id: string,
        public name: string,
        public email: string | null,
        private password: string,
        public phone: string | null,
        public birthDate: Date | null,
        public rfc: string | null
    ) { }

    updateName(newName: string): void {
        if (newName.trim().length < 2) {
            throw new Error("El nombre debe tener al menos 2 caracteres");
        }
        this.name = newName.trim();
    }

    getPassword(): string {
        return this.password;
    }

    // Método de autenticación Valida Credenciales
    async authenticate(plainPassword: string, hashService: HashService) {
        const valid = await hashService.compare(plainPassword, this.password);
        if (!valid) {
            throw new Error("Credenciales invalidas");
        }
        return true;
    }
}