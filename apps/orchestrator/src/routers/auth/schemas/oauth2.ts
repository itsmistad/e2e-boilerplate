import { z } from 'zod';

/**
 * OAuth2 auth URL schema
 */
export const oauth2AuthUrlSchema = z.object({
    provider: z.string(),
    redirectUrl: z.string().url().optional(),
});

export type OAuth2AuthUrl = z.infer<typeof oauth2AuthUrlSchema>;

/**
 * OAuth2 callback schema
 */
export const oauth2CallbackSchema = z.object({
    provider: z.string(),
    code: z.string(),
    state: z.string().optional(),
});

export type OAuth2Callback = z.infer<typeof oauth2CallbackSchema>;
