import Role from "../enums/role.enum";

export interface ActiveUserData {
    readonly sub: number;
    readonly email: string;
    readonly role: Role;
    readonly refreshTokenId?: string; 
}