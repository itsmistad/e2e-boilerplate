import { TRPCError } from '@trpc/server';
import { pb } from '@lib/pocketbase';
import { router, procedure } from '../../../trpc';
import { oauth2AuthUrlSchema, oauth2CallbackSchema } from '../schemas/oauth2';
import { authResponseSchema } from '../schemas/session';
import { mapPocketBaseUser } from '../utils';

export const oauth2Router = router({
    /**
     * Get OAuth2 authorization URL
     */
    getAuthUrl: procedure.input(oauth2AuthUrlSchema).query(async (opts) => {
        const { provider, redirectUrl } = opts.input;

        try {
            // Get OAuth2 auth URL from PocketBase
            const authMethods = await pb.collection('users').listAuthMethods();
            const oauthProvider = authMethods.oauth2.providers?.find((p) => p.name === provider);

            if (!oauthProvider) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: `OAuth2 provider '${provider}' is not configured`,
                });
            }

            // Build the auth URL
            const authUrl = `${pb.baseUrl}/api/oauth2/${provider}/redirect?redirectUrl=${encodeURIComponent(redirectUrl || '')}`;

            return {
                authUrl,
                provider,
            };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to get OAuth2 auth URL';
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message,
            });
        }
    }),

    /**
     * Handle OAuth2 callback
     */
    callback: procedure.input(oauth2CallbackSchema).mutation(async (opts) => {
        const { provider, code, state } = opts.input;

        try {
            // Authenticate with OAuth2
            // Note: PocketBase handles OAuth2 callbacks differently
            // This is a simplified version - in production, you'd handle the full OAuth2 flow
            const authData = await pb.collection('users').authWithOAuth2({
                provider,
                code,
                codeVerifier: state, // In production, use proper PKCE
            });

            return authResponseSchema.parse({
                token: authData.token || '',
                record: mapPocketBaseUser(authData.record),
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'OAuth2 authentication failed';
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message,
            });
        }
    }),
});
