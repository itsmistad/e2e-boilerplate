# Authentication System

This document describes the authentication system implemented using PocketBase TypeScript SDK.

## Overview

The authentication system provides:

- **Password Authentication**: Email/password registration and login
- **OTP (One-Time Password)**: Email/SMS-based OTP verification
- **OAuth2**: Support for OAuth2 providers (Google, GitHub, etc.)
- **MFA (Multi-Factor Authentication)**: TOTP-based MFA support
- **Role-Based Access Control**: User and Admin roles (easily extensible)

## Architecture

### Components

1. **PocketBase Client** (`src/lib/pocketbase.ts`)

    - Singleton PocketBase instance
    - Request-specific instances for token-based operations

2. **Authentication Middleware** (`src/middleware/auth.ts`)

    - Token extraction and verification
    - User context creation
    - Role checking utilities

3. **Access Control Middleware** (`src/middleware/accessControl.ts`)

    - Procedure decorators for authentication/authorization
    - Role-based access control helpers

4. **Authentication Router** (`src/routers/auth/authRouter.ts`)

    - All authentication endpoints
    - Session management

5. **Authentication Schemas** (`src/routers/auth/authSchema.ts`)
    - Zod schemas for validation
    - Type definitions

## Setup

### 1. Environment Variables

Add to your `.env` file:

```env
POCKETBASE_URL=http://localhost:8090
```

### 2. PocketBase Configuration

You need to configure PocketBase with a `users` collection that includes:

- `email` (required)
- `password` (required, but stored hashed)
- `username` (optional)
- `role` (text field, default: "user")
- `mfaEnabled` (boolean, optional)
- `mfaSecret` (text, optional, for TOTP)

To add the `role` field to your PocketBase users collection:

1. Open PocketBase Admin UI (`http://localhost:8090/_/`)
2. Go to Collections → users
3. Add a new field:
    - Name: `role`
    - Type: `Text`
    - Default value: `user`
    - Options: `user`, `admin`

### 3. OAuth2 Providers (Optional)

To enable OAuth2, configure providers in PocketBase Admin UI:

1. Go to Settings → Auth providers
2. Add your OAuth2 providers (Google, GitHub, etc.)
3. Configure client IDs and secrets

## Usage

### Authentication Endpoints

#### Password Authentication

```typescript
// Register
await trpc.auth.password.register.mutate({
    email: 'user@example.com',
    password: 'securepassword',
    passwordConfirm: 'securepassword',
    role: 'user', // optional, defaults to 'user'
});

// Login
await trpc.auth.password.login.mutate({
    email: 'user@example.com',
    password: 'securepassword',
});

// Change Password (requires authentication)
await trpc.auth.password.changePassword.mutate({
    oldPassword: 'oldpassword',
    newPassword: 'newpassword',
    newPasswordConfirm: 'newpassword',
});

// Request Password Reset
await trpc.auth.password.requestReset.mutate({
    email: 'user@example.com',
});

// Reset Password
await trpc.auth.password.reset.mutate({
    token: 'reset-token',
    password: 'newpassword',
    passwordConfirm: 'newpassword',
});
```

#### OTP Authentication

```typescript
// Request OTP
await trpc.auth.otp.request.mutate({
    email: 'user@example.com',
    method: 'email', // or 'sms'
});

// Verify OTP
await trpc.auth.otp.verify.mutate({
    email: 'user@example.com',
    otp: '123456',
});
```

#### OAuth2 Authentication

```typescript
// Get OAuth2 Auth URL
const { authUrl } = await trpc.auth.oauth2.getAuthUrl.query({
    provider: 'google',
    redirectUrl: 'http://localhost:3000/callback',
});

// Handle OAuth2 Callback
await trpc.auth.oauth2.callback.mutate({
    provider: 'google',
    code: 'oauth-code',
    state: 'state-value',
});
```

#### MFA (Multi-Factor Authentication)

```typescript
// Enable MFA
const { secret, qrCode } = await trpc.auth.mfa.enable.mutate({
    method: 'totp',
});

// Verify MFA Code
await trpc.auth.mfa.verify.mutate({
    code: '123456',
    method: 'totp',
});

// Disable MFA
await trpc.auth.mfa.disable.mutate({
    password: 'userpassword',
});
```

#### Session Management

```typescript
// Get Current User
const user = await trpc.auth.session.me.query();

// Refresh Token
const { token, record } = await trpc.auth.session.refresh.mutate({
    refreshToken: 'refresh-token',
});

// Logout
await trpc.auth.session.logout.mutate();
```

### Access Control in Routers

#### Public Endpoint (No Authentication)

```typescript
export const publicRouter = router({
    publicEndpoint: procedure.query(() => {
        // Anyone can access
    }),
});
```

#### Authenticated Endpoint (Any Authenticated User)

```typescript
import { createAuthenticatedProcedure } from '../../middleware/accessControl';

export const userRouter = router({
    protectedEndpoint: createAuthenticatedProcedure(procedure).query((opts) => {
        const { user } = opts.ctx; // User is guaranteed to exist
        // Only authenticated users can access
    }),
});
```

#### User Role Endpoint (User or Admin)

```typescript
import { createUserProcedure } from '../../middleware/accessControl';

export const userRouter = router({
    userEndpoint: createUserProcedure(procedure).query((opts) => {
        const { user } = opts.ctx;
        // Users with 'user' or 'admin' role can access
    }),
});
```

#### Admin Only Endpoint

```typescript
import { createAdminProcedure } from '../../middleware/accessControl';

export const adminRouter = router({
    adminEndpoint: createAdminProcedure(procedure).query((opts) => {
        const { user } = opts.ctx;
        // Only users with 'admin' role can access
    }),
});
```

#### Custom Role-Based Access Control

```typescript
import { createRoleProtectedProcedure } from '../../middleware/accessControl';
import { UserRole } from '../auth/authSchema';

export const customRouter = router({
    customEndpoint: createRoleProtectedProcedure(
        procedure,
        [UserRole.ADMIN], // Required roles
        {
            customCheck: async (authContext) => {
                // Custom authorization logic
                return authContext.user?.email?.endsWith('@example.com') ?? false;
            },
        },
    ).query((opts) => {
        // Custom access control
    }),
});
```

## Extending Roles

To add new roles:

1. **Update the UserRole enum** in `src/routers/auth/authSchema.ts`:

```typescript
export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MODERATOR = 'moderator', // New role
}
```

2. **Add role to PocketBase**:

    - Update the `role` field options in PocketBase Admin UI
    - Or update the field to allow any text value

3. **Create role-specific procedure helper** (optional):

```typescript
export function createModeratorProcedure<T extends Procedure>(
    baseProcedure: T,
    options: Omit<AccessControlOptions, 'roles'> = {},
) {
    return createRoleProtectedProcedure(baseProcedure, [UserRole.MODERATOR, UserRole.ADMIN], options);
}
```

## Client-Side Usage

### Setting Authentication Token

When making requests from the client, include the token in the Authorization header:

```typescript
// After login
const { token } = await trpc.auth.password.login.mutate({
    /*...*/
});

// Store token (e.g., in localStorage, secure storage, etc.)
localStorage.setItem('authToken', token);

// Configure tRPC client to include token
const trpcClient = createTRPCClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000',
            headers: () => {
                const authToken = localStorage.getItem('authToken');
                return authToken ? { Authorization: `Bearer ${authToken}` } : {};
            },
        }),
    ],
});
```

## Security Considerations

1. **Password Requirements**: Minimum 8 characters (customize in schemas)
2. **Token Storage**: Store tokens securely (use httpOnly cookies in production)
3. **HTTPS**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for authentication endpoints
5. **MFA**: Encourage MFA for sensitive operations
6. **Token Expiration**: Tokens should have expiration times
7. **Refresh Tokens**: Use refresh tokens for long-lived sessions

## Testing

Example test for authenticated endpoint:

```typescript
import { createCaller } from '../routers/appRouter';

const caller = createCaller({
    auth: {
        user: { id: '1', email: 'test@example.com', role: 'admin' },
        isAuthenticated: true,
        token: 'test-token',
    },
});

const result = await caller.user.list();
```

## Troubleshooting

### "Authentication required" error

- Ensure token is included in Authorization header
- Check token hasn't expired
- Verify token format: `Bearer <token>` or just `<token>`

### "Access denied" error

- Check user has required role
- Verify role field exists in PocketBase user record
- Check custom authorization function if used

### PocketBase connection errors

- Verify PocketBase is running (`pnpm pb:serve`)
- Check `POCKETBASE_URL` environment variable
- Ensure PocketBase is accessible from your application
