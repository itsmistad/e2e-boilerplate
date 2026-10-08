import { z } from 'zod';

/**
 * MFA method schema
 */
export const mfaMethodSchema = z.enum(['totp', 'sms']);

export type MfaMethod = z.infer<typeof mfaMethodSchema>;

/**
 * Enable MFA schema
 */
export const mfaEnableSchema = z.object({
    method: mfaMethodSchema.default('totp'),
});

export type MfaEnable = z.infer<typeof mfaEnableSchema>;

/**
 * Verify MFA schema
 */
export const mfaVerifySchema = z.object({
    code: z.string(),
    method: mfaMethodSchema.default('totp'),
});

export type MfaVerify = z.infer<typeof mfaVerifySchema>;

/**
 * Disable MFA schema
 */
export const mfaDisableSchema = z.object({
    password: z.string().min(8),
});

export type MfaDisable = z.infer<typeof mfaDisableSchema>;

/**
 * MFA setup response schema
 */
export const mfaSetupResponseSchema = z.object({
    secret: z.string().optional(),
    qrCode: z.string().optional(),
    backupCodes: z.array(z.string()).optional(),
});

export type MfaSetupResponse = z.infer<typeof mfaSetupResponseSchema>;
