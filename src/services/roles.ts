import { config } from "../config/config";

type authRole = 'READ' | 'WRITE' | 'EDIT' | 'GRANT' | 'ADMIN';

export interface IRoles extends Document {
    roleIncludes(roles: authRole | authRole[]): boolean;
}

const configAuth: { [AUTH: string]: number } = config.AUTH;

export function intoRoles(role: number): string[] {
    return Object.keys(configAuth).filter(auths => !!(role & configAuth[auths]));
}

export function intoRole(roles: authRole[]): number {
    return roles.reduce((accumulator, role) => accumulator |= configAuth[role], 0);
}

export function hasValidRoles(roles: authRole | authRole[]): boolean {
    if (Array.isArray(roles) && !!roles?.length)
        return roles.every(r => Object.keys(configAuth).includes(r));
    else if (!Array.isArray(roles) && !!roles?.trim())
        return Object.keys(configAuth).includes(roles);
    else
        return false;

}

export function roleIncludes(this: any, roles: authRole | authRole[]): boolean {
    if (!hasValidRoles(roles))
        return false

    return Array.isArray(roles)
        ? roles.some(r => !!(this.role & configAuth[r]))
        : !!(this.role & configAuth[roles]);
}