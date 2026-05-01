import { UserRepository } from "../infrastructure/user.repository";
import { User } from "../domain/User";
import { JwtService } from "@/infrastructure/security/jwt.service";
import { HashService } from "@/infrastructure/security/has.service";

// NOTA: El repositorio abstrae toda la persistencia 

export class UserService {
  constructor(
    private repo: UserRepository,
    private hashService: HashService,
    private jwtService: JwtService
  ) { }

  // Caso de uso: Registro de usuario
  async register(data: { name: string; email: string; password: string; }): Promise<void> {
    const existing = await this.repo.findByEmail(data.email);                             // Verificar que el email sea unico antes de crear
    if (existing) throw new Error("El email ya está registrado");

    const hashedPassword = await this.hashService.hash(data.password);                    // Hashear ANTES de construir el objeto User

    const user = new User(                                                                // Construye la entidad de dominio con un id único
      crypto.randomUUID(),
      data.name,
      data.email,
      hashedPassword
    );

    await this.repo.create(user);                                                        // Persiste y ya guardado en BD
  }

  // Caso de uso: Loguear Usuario
  async login(email: string, password: string): Promise<{ token: string }> {
    const user = await this.repo.findByEmail(email);                                      // Busca usuario. NOTA: EL repo devuelve una entidad de dominio User

    if (!user) throw new Error("Credenciales inválidas");

    await user.authenticate(password, this.hashService);                                 // Delegar la validación de contraseña al DOMINIO (User.ts)

    const token = await this.jwtService.sign({                                           // Generar JWT con el id y los roles del usuario
      userId: user.id,
      roles: user.roles.map(r => r.name),
    });

    return { token };
  }

  // Caso de uso: Asignar rol 
  async assignRole(userId: string, roleId: string): Promise<User> {
    const user = await this.repo.findById(userId);                                      // Busca ambos objetos de dominio antes de operar
    const role = await this.repo.findRoleById(roleId);
    if (!role) throw new Error("Rol no encontrado");

    await this.repo.addRole(user, role);                                                // Añade y verifica duplicado

    return user;
  }

  // Caso de uso: Eliminar rol 
  async removeRole(userId: string, roleId: string): Promise<User> {
    const user = await this.repo.findById(userId);

    const hasRole = user.roles.some(r => r.id === roleId);                             // Verificar que el rol existe en el usuario antes de intentar eliminarlo
    if (!hasRole) throw new Error("El usuario no tiene ese rol");

    await this.repo.removeRole(user, roleId);                                          // El repo elimina de BD y sincroniza user.roles en memoria

    return user;
  }

  // Caso de uso: Cambiar contraseña 
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.repo.findById(userId);                                    // Busca por ID el usuario

    await user.authenticate(currentPassword, this.hashService);                       // Valida la contraseña actual usando el dominio, si hay erro lo marca

    const hashedNew = await this.hashService.hash(newPassword);                       // Hashear la nueva contraseña  
    await this.repo.updatePassword(userId, hashedNew);                                // Actualizar solo el campo password en BD
  }

  async listUsers(): Promise<User[]> {
    return this.repo.findAll()
  }
}