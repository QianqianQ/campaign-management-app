/**
 * Authentication types
 */

export interface AuthContextType {
    // TODO: add type for user
    user: Record<string, string> | null;
    signin: (formData: Record<string, string>) => Promise<{ success: boolean; errors?: Record<string, unknown> }>;
    signout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}
