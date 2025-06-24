export interface User {
    name: string;
    lastName?: string;
    address?: string;
    email: string;
    role?: string;
    id?: string;
    enabled?: boolean;
    roleId?: number; 
    password?: string; 
}