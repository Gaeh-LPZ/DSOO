
import { prisma } from "@/lib/prisma";
import { User } from "../domain/User";
import { Role } from "../domain/Roles";
import { Permission } from "../domain/Permission";
import { IUserWithRoles, IUserRoleRow, IRolePermissionRow, IRoleWithPermissions,} from "../interfaces/types";

export class UserRepository {

  // Include reutilizable 
  private readonly includeRoles = {
    roles: {
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    },
  } as const;

  // Mapeo BD → Dominio 
  private mapToUser(data: IUserWithRoles): User {
    return new User(
      data.id,
      data.name,
      data.email,
      data.password,
      data.isActive,
      data.roles.map((ur: IUserRoleRow) =>
        new Role(
          ur.role.id,
          ur.role.name,
          ur.role.description ?? null,
          ur.role.permissions.map((rp: IRolePermissionRow) =>
            new Permission(rp.permission.id, rp.permission.name)
          )
        )
      ),
      data.storeId
    );
  }

  private mapToRole(data: IRoleWithPermissions): Role {
    return new Role(
      data.id,
      data.name,
      data.description ?? null,
      data.permissions.map((rp: IRolePermissionRow) =>
        new Permission(rp.permission.id, rp.permission.name)
      )
    );
  }

  // Metodo pa crear funcion en la BD
  async create(user: User, roleName: string): Promise<void> {
    const role = await prisma.role.findUnique({
      where: { name: roleName }
    });

    if (!role) throw new Error(`El rol "${roleName}" no existe`);

    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.getPassword(),
        isActive: user.isActive,
        storeId: user.storeId,
        roles: {
          create: [{ roleId: role.id }],
        },
      },
      include: this.includeRoles,
    });
  }

  // Metodo para buscar email
  async findByEmail(email: string): Promise<User | null> {
    const data = await prisma.user.findUnique({
      where: { email },
      include: this.includeRoles,
    });

    if (!data) return null;
    return this.mapToUser(data as IUserWithRoles);
  }

  // Metodo pa buscar por ID
  async findById(id: string): Promise<User> {
    const data = await prisma.user.findUnique({
      where: { id },
      include: this.includeRoles,
    });

    if (!data) throw new Error("Usuario no encontrado");
    return this.mapToUser(data as IUserWithRoles);
  }

  // Metodo actualizar Usuario
  async update(user: User): Promise<User> {
    const data = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        storeId: user.storeId
      },
      include: this.includeRoles,
    });

    return this.mapToUser(data as IUserWithRoles);
  }

  // Metodo actualiza password
  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  // Metodo busca roles por ID
  async findRoleById(roleId: string): Promise<Role | null> {
    const data = await prisma.role.findUnique({
      where: { id: roleId },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });

    if (!data) return null;
    return this.mapToRole(data as IRoleWithPermissions);
  }

  // Metodo añade rol
  async addRole(user: User, role: Role): Promise<void> {
    if (user.hasRole(role.name)) {
      throw new Error(`El rol "${role.name}" ya está asignado`);
    }

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });

    user.addRole(role);
  }

  // Metodo pa quitar rol
  async removeRole(user: User, roleId: string): Promise<void> {
    await prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId,
        },
      },
    });

    user.roles = user.roles.filter(r => r.id !== roleId);
  }

  async findAll(): Promise<User[]> {
    const data = await prisma.user.findMany({
      where: { isActive: true },
      include: this.includeRoles
    })
    return data.map(u => this.mapToUser(u as IUserWithRoles))
  }

  async findAllRoles(): Promise<Role[]> {
    const data = await prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });
    return data.map(r => this.mapToRole(r as IRoleWithPermissions));
  }

  async createRole(name: string, description: string, permissionNames: string[]): Promise<void> {
    const permissions = await Promise.all(
      permissionNames.map(name =>
        prisma.permission.upsert({
          where: { name },
          update: {},
          create: { name }
        })
      )
    );

    await prisma.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissions.map(p => ({ permissionId: p.id }))
        }
      }
    });
  }

  async findAllPermissions() {
    return prisma.permission.findMany();
  }

  async findSystemUser(): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email: "sistema@luxury.com" },
      select: { id: true }
    })
    if (!user) throw new Error("Usuario sistema no configurado")
    return user.id
  }
}