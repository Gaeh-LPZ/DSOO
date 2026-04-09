export interface IPermission {
  id: string;
  name: string;
}

export interface IRole {
  id: string;
  name: string;
  description?: string | null;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
}

export interface IRolePermissionRow {
  roleId: string;
  permissionId: string;
  permission: IPermission;        // RolePermission → permission
}

export interface IUserRoleRow {
  userId: string;
  roleId: string;
  role: IRole & {
    permissions: IRolePermissionRow[]; // Role → permissions (RolePermission[])
  };
}

export interface IUserWithRoles extends IUser {
  roles: IUserRoleRow[];
}

export interface IRoleWithPermissions extends IRole {
  permissions: IRolePermissionRow[];
}