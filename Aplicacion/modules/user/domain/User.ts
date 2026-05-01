import { HashService } from "@/infrastructure/security/has.service";
import { Role } from "./Roles";

export class User {
    constructor(
        public id: string,
        public name: string,
        public email: string,
        private password: string,
        public isActive: boolean = true,
        public roles: Role[] = [],
        public storeId: string | null = null
    ) { }

    addRole(role: Role) {                                                   
        if (this.roles.find(r => r.name === role.name)) {
            throw new Error(`El rol "${role.name}" ya está asignado`);      //No se puede asignar un rol que ya tiene
        }
        this.roles.push(role);
    }

    // Consulta a BD si tiene rol, (envia)
    hasRole(roleName: string): boolean {
        return this.roles.some(r => r.name === roleName);
    }

    // Desactivar cuenta de usuario
    deactivate() {
        if (!this.isActive) {
            throw new Error("El usuario ya está inactivo");
        }
        this.isActive = false;
    }

    // Se asigna hash
    setPassword(hash: string) {
        this.password = hash;
    }

    // Trae password solo servicio
    getPassword() {
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