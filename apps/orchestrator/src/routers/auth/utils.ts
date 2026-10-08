import type { UsersResponse } from '@lib/pocketbase/types';

/**
 * Map PocketBase user record to AuthUser type
 */
export function mapPocketBaseUser(pbUser: UsersResponse<unknown>) {
    return {
        id: pbUser.id,
        email: pbUser.email,
        name: pbUser.name,
        emailVisibility: pbUser.emailVisibility,
        verified: pbUser.verified,
        role: pbUser.role,
        mfaEnabled: pbUser.mfaEnabled,
        created: pbUser.created,
        updated: pbUser.updated,
    };
}
