import { z } from 'zod';

/**
 * Refresh token schema
 */
export const refreshTokenSchema = z.object({
    refreshToken: z.string(),
});

export type RefreshToken = z.infer<typeof refreshTokenSchema>;

/**
 * Auth response schema
 */
export const authResponseSchema = z.object({
    token: z.string(),
    record: User,
});

export type AuthResponse = z.infer<typeof authResponseSchema>;
