import PocketBase from 'pocketbase';
import type { TypedPocketBase } from './__generated__/types';
import { env } from '../../env';

/**
 * PocketBase client instance
 * This is a singleton instance that should be reused across the application
 */
export const pb = new PocketBase(env.POCKETBASE_URL) as TypedPocketBase;

/**
 * Initialize PocketBase client
 * Call this during application startup
 */
export async function initializePocketBase() {
    try {
        // Optionally authenticate with admin credentials if needed
        // await pb.admins.authWithPassword(env.POCKETBASE_ADMIN_EMAIL, env.POCKETBASE_ADMIN_PASSWORD);
        return pb;
    } catch (error) {
        console.error('Failed to initialize PocketBase:', error);
        throw error;
    }
}

/**
 * Get a fresh PocketBase instance for request-specific operations
 * This is useful when you need to set auth tokens per request
 */
export function createPocketBaseInstance(token?: string) {
    const instance = new PocketBase(env.POCKETBASE_URL) as TypedPocketBase;
    if (token) {
        instance.authStore.save(token, null);
    }
    return instance;
}
