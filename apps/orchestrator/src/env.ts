import { z } from 'zod';
import '@dotenvx/dotenvx';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    POCKETBASE_URL: z.string().url().default('http://localhost:8090'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    throw new Error('Faile to parse environment variables');
}

export type EnvironmentVariables = z.infer<typeof envSchema>;
export const env: EnvironmentVariables = parsedEnv.data;
