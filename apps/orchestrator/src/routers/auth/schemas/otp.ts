import { z } from 'zod';

/**
 * OTP delivery method schema
 */
export const otpMethodSchema = z.enum(['email', 'sms']);

export type OtpMethod = z.infer<typeof otpMethodSchema>;

/**
 * Request OTP schema
 */
export const otpRequestSchema = z.object({
    email: z.string().email(),
    method: otpMethodSchema.optional().default('email'),
});

export type OtpRequest = z.infer<typeof otpRequestSchema>;

/**
 * Verify OTP schema
 */
export const otpVerifySchema = z.object({
    email: z.string().email(),
    otp: z.string().length(6),
});

export type OtpVerify = z.infer<typeof otpVerifySchema>;

/**
 * OTP response schema
 */
export const otpResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type OtpResponse = z.infer<typeof otpResponseSchema>;
