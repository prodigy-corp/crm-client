/**
 * Permission and Role Utility Functions
 * Centralized permission checking for consistent access control
 */

export interface User {
    id: string;
    name: string;
    email: string;
    roles?: string[];
    permissions?: string[];
    [key: string]: any;
}

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null | undefined, role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null | undefined, roles: string[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.some(role => user.roles!.includes(role));
};

/**
 * Check if user has all of the specified roles
 */
export const hasAllRoles = (user: User | null | undefined, roles: string[]): boolean => {
    if (!user || !user.roles) return false;
    return roles.every(role => user.roles!.includes(role));
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (user: User | null | undefined, permission: string): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (user: User | null | undefined, permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.some(perm => user.permissions!.includes(perm));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (user: User | null | undefined, permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    return permissions.every(perm => user.permissions!.includes(perm));
};

/**
 * Check if user is an admin (SUPER_ADMIN or ADMIN)
 */
export const isAdmin = (user: User | null | undefined): boolean => {
    return hasAnyRole(user, ['SUPER_ADMIN', 'ADMIN']);
};

/**
 * Check if user is a super admin
 */
export const isSuperAdmin = (user: User | null | undefined): boolean => {
    return hasRole(user, 'SUPER_ADMIN');
};

/**
 * Check if user is an employee
 */
export const isEmployee = (user: User | null | undefined): boolean => {
    return hasRole(user, 'EMPLOYEE');
};

/**
 * Check if user is a client
 */
export const isClient = (user: User | null | undefined): boolean => {
    return hasRole(user, 'CLIENT');
};

/**
 * Get the primary route for a user based on their roles
 */
export const getPrimaryRoute = (user: User | null | undefined): string => {
    if (!user) return '/auth/login';

    // Admin users go to admin dashboard
    if (isAdmin(user)) {
        return '/admin/dashboard';
    }

    // All other authenticated users go to unified dashboard
    return '/dashboard';
};

/**
 * Check if user can access a route
 */
export const canAccessRoute = (
    user: User | null | undefined,
    requiredRoles?: string[],
    requiredPermissions?: string[]
): boolean => {
    if (!user) return false;

    // If no requirements, route is accessible to all authenticated users
    if (!requiredRoles && !requiredPermissions) return true;

    // Check roles
    if (requiredRoles && !hasAnyRole(user, requiredRoles)) {
        return false;
    }

    // Check permissions
    if (requiredPermissions && !hasAnyPermission(user, requiredPermissions)) {
        return false;
    }

    return true;
};
