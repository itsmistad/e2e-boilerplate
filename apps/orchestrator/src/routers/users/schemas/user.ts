import { z } from 'zod';
import { UsersRoleOptions } from '@lib/pocketbase/types';

export const createUserParamsSchema = z.object({
    type: z.literal('email-password'),
    email: z.string().email(),
    name: z.string(),
    role: z.nativeEnum(UsersRoleOptions),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
});
export type CreateUserParams = z.infer<typeof createUserParamsSchema>;
