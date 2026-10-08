import { z } from 'zod';
import { UsersRoleOptions } from '@lib/pocketbase/types';

/**
 * Password login schema
 */
export const passwordLoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

export type PasswordLogin = z.infer<typeof passwordLoginSchema>;

/**
 * Password registration schema
 */
export const passwordRegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
    username: z.string().optional(),
    role: z.nativeEnum(UsersRoleOptions).optional().default(UsersRoleOptions.user),
});

export type PasswordRegister = z.infer<typeof passwordRegisterSchema>;

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    newPasswordConfirm: z.string().min(8),
});

export type ChangePassword = z.infer<typeof changePasswordSchema>;

/**
 * Request password reset schema
 */
export const resetPasswordRequestSchema = z.object({
    email: z.string().email(),
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

/**
 * Reset password schema
 */
export const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
});

export type ResetPassword = z.infer<typeof resetPasswordSchema>;
