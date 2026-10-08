import { TRPCError } from '@trpc/server';
import { pb } from '../../../lib/pocketbase/pocketbase';
import { router, procedure } from '../../../trpc';
import { otpRequestSchema, otpVerifySchema, otpResponseSchema } from '../schemas/otp';

export const otpRouter = router({
    /**
     * Request OTP code
     */
    request: procedure.input(otpRequestSchema).mutation(async (opts) => {
        const { email, method } = opts.input;

        try {
            // PocketBase doesn't have built-in OTP, so we'll use email verification
            // In a production system, you'd integrate with an OTP service (Twilio, AWS SNS, etc.)
            await pb.collection('users').requestVerification(email);

            return otpResponseSchema.parse({
                success: true,
                message: `OTP code sent to ${method === 'sms' ? 'phone' : 'email'}`,
            });
        } catch {
            // For security, don't reveal if email exists
            return otpResponseSchema.parse({
                success: true,
                message: 'If the email exists, an OTP code has been sent',
            });
        }
    }),

    /**
     * Verify OTP code
     */
    verify: procedure.input(otpVerifySchema).mutation(async (opts) => {
        const { otp } = opts.input;

        try {
            // Verify the OTP code
            // Note: PocketBase uses verification tokens, not OTP codes directly
            // In production, you'd verify the OTP against your OTP service
            await pb.collection('users').confirmVerification(otp);

            // After verification, you might want to auto-login or return success
            return otpResponseSchema.parse({
                success: true,
                message: 'OTP verified successfully',
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid or expired OTP code';
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message,
            });
        }
    }),
});
