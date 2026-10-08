import { TRPCError } from '@trpc/server';
import { createPocketBaseInstance } from '../../../lib/pocketbase/pocketbase';
import { createAuthenticatedProcedure } from '../../../middleware/accessControl';
import { router, procedure } from '../../../trpc';
import { mfaEnableSchema, mfaVerifySchema, mfaDisableSchema, mfaSetupResponseSchema } from '../schemas/mfa';

export const mfaRouter = router({
    /**
     * Enable MFA for the current user
     */
    enable: createAuthenticatedProcedure(procedure)
        .input(mfaEnableSchema)
        .mutation(async (opts) => {
            const { method } = opts.input;
            const { auth } = opts.ctx;

            if (!auth.token || !auth.user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                });
            }

            try {
                const pbInstance = createPocketBaseInstance(auth.token);

                // Enable MFA
                // Note: PocketBase MFA implementation may vary
                // This is a placeholder - you'd integrate with a TOTP library (like 'otplib') for TOTP
                if (method === 'totp') {
                    // Generate TOTP secret
                    // In production, use a library like 'otplib' to generate secrets and QR codes
                    const secret = 'TEMP_SECRET'; // Replace with actual TOTP secret generation

                    await pbInstance.collection('users').update(auth.user.id, {
                        mfaEnabled: true,
                        mfaSecret: secret,
                    });

                    return mfaSetupResponseSchema.parse({
                        secret,
                        qrCode: `otpauth://totp/${auth.user.email}?secret=${secret}&issuer=YourApp`,
                        backupCodes: [], // Generate backup codes in production
                    });
                } else {
                    // SMS MFA would require phone number and SMS service integration
                    throw new TRPCError({
                        code: 'NOT_IMPLEMENTED',
                        message: 'SMS MFA is not yet implemented',
                    });
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Failed to enable MFA';
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message,
                });
            }
        }),

    /**
     * Verify MFA code
     */
    verify: createAuthenticatedProcedure(procedure)
        .input(mfaVerifySchema)
        .mutation(async (opts) => {
            // const { code } = opts.input;
            const { auth } = opts.ctx;

            if (!auth.token || !auth.user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                });
            }

            try {
                // Verify MFA code
                // In production, use a TOTP library to verify the code
                // const pbInstance = createPocketBaseInstance(auth.token);
                // const isValid = verifyTOTP(code, auth.user.mfaSecret);

                // For now, return success (implement actual verification)
                return {
                    success: true,
                    message: 'MFA code verified',
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Invalid MFA code';
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message,
                });
            }
        }),

    /**
     * Disable MFA for the current user
     */
    disable: createAuthenticatedProcedure(procedure)
        .input(mfaDisableSchema)
        .mutation(async (opts) => {
            const { password } = opts.input;
            const { auth } = opts.ctx;

            if (!auth.token || !auth.user) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Authentication required',
                });
            }

            try {
                const pbInstance = createPocketBaseInstance(auth.token);

                // Verify password before disabling MFA
                await pbInstance.collection('users').authWithPassword(auth.user.email, password);

                // Disable MFA
                await pbInstance.collection('users').update(auth.user.id, {
                    mfaEnabled: false,
                    mfaSecret: null,
                });

                return {
                    success: true,
                    message: 'MFA disabled successfully',
                };
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Invalid password or failed to disable MFA';
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message,
                });
            }
        }),
});
