import { z } from 'zod';

/**
 * Authentication method enum schema
 */
export const authMethodSchema = z.enum(['password', 'otp', 'oauth2', 'mfa']);

export type AuthMethod = z.infer<typeof authMethodSchema>;
