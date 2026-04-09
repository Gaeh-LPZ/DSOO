import { Permission } from "./Permission";

export class Role {
    constructor(
        public id: string,
        public name: string,
        public permission: Permission[]
    ) { }

    // Regla de negocio: no duplicar permisos
    addPermission(permission: Permission): void {
        if (this.permission.find(p => p.name === permission.name)) {
            throw new Error(`El permiso "${permission.name}" ya existe en este rol`);
        }
        this.permission.push(permission);
    }

    // Consulta si se tiene ese permiso
    hasPermision(permissionName: string): boolean {
        return this.permission.some(p => p.name === permissionName)
    }
}