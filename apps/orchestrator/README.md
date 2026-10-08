# Orchestrator

A tRPC-based backend API server with PocketBase integration for data persistence. This application provides a robust foundation for building scalable backend services with type-safe APIs.

## Features

- **tRPC Server**: Type-safe API endpoints with automatic TypeScript inference
- **PocketBase Integration**: Built-in database and authentication system
- **Zod Validation**: Runtime type validation for all inputs and outputs
- **SuperJSON**: Enhanced serialization for complex data types
- **Vitest Testing**: Comprehensive test suite with mocking capabilities
- **ESLint & Prettier**: Code quality and formatting tools
- **TypeScript**: Full type safety throughout the application

## Setup

### Prerequisites

- Node.js 18+
- pnpm (package manager)
- PocketBase binary (included in the project)

### Installation

1. Install dependencies from the workspace root:

```bash
pnpm install
```

2. Set up environment variables:

```bash
# Create .env file if needed
NODE_ENV=development
```

3. Start PocketBase (optional, for database operations):

```bash
pnpm pb:serve
```

## Development

### Starting the Development Server

```bash
pnpm start
```

The server will start on `http://localhost:3000` with hot reload enabled.

### Available Scripts

- `pnpm start` - Start the development server
- `pnpm test` - Run the test suite
- `pnpm test:watch` - Run tests in watch mode
- `pnpm lint` - Check code quality with ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm build` - Build the project for production
- `pnpm clean` - Clean build artifacts
- `pnpm unused` - Check for unused dependencies with Knip

### PocketBase Commands

- `pnpm pb:serve` - Start PocketBase server (auto-detects OS)
- `pnpm pb:help` - Show PocketBase help

## Adding Routers

### 1. Create Router File

Create a new router file in `src/routers/[feature]/[feature]Router.ts`:

```typescript
import { z } from 'zod';
import { router, procedure } from '../../trpc';

export const featureRouter = router({
    // Query example
    list: procedure.query(async () => {
        // Your logic here
        return [];
    }),

    // Mutation example
    create: procedure
        .input(
            z.object({
                name: z.string(),
                description: z.string().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            // Your logic here
            return { id: 'new-id', ...input };
        }),
});
```

### 2. Add to App Router

Update `src/routers/appRouter.ts`:

```typescript
import { featureRouter } from './feature/featureRouter';

export const appRouter = router({
    health: healthRouter,
    user: usersRouter,
    feature: featureRouter, // Add your router here
});
```

### 3. Create Schema (Optional)

If your router needs complex data structures, create a schema file:

```typescript
// src/routers/feature/featureSchema.ts
import { z } from 'zod';

export const featureSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
});

export type Feature = z.infer<typeof featureSchema>;
```

## Adding Tests

### 1. Create Test File

Create a test file next to your router: `src/routers/[feature]/[feature]Router.test.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createCaller } from '../appRouter';

describe('Feature Router', () => {
    let caller: ReturnType<typeof createCaller>;

    beforeEach(() => {
        caller = createCaller({
            auth: {
                user: null,
                token: null,
                isAuthenticated: false,
            },
        });
    });

    it('should list features', async () => {
        const result = await caller.feature.list();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should create a feature', async () => {
        const input = {
            name: 'Test Feature',
            description: 'A test feature',
        };

        const result = await caller.feature.create(input);
        expect(result).toHaveProperty('id');
        expect(result.name).toBe(input.name);
    });
});
```

### 2. Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test featureRouter.test.ts
```

### Testing Best Practices

- Use `createCaller` to test your routers without HTTP overhead
- Mock external dependencies using Vitest's mocking capabilities
- Test both success and error cases
- Validate input/output schemas
- Use descriptive test names and organize tests with `describe` blocks

## Building

### Development Build

```bash
pnpm build
```

This compiles TypeScript and outputs to the `dist` directory.

### Production Considerations

1. **Environment Variables**: Ensure all required environment variables are set
2. **PocketBase**: Make sure PocketBase is properly configured for production
3. **Database**: Ensure database connections are properly configured
4. **Security**: Review and implement proper authentication/authorization

## PocketBase Integration

This project includes PocketBase for database operations and authentication. PocketBase provides:

- **SQLite Database**: Lightweight, file-based database
- **Real-time Subscriptions**: WebSocket support for real-time updates
- **Authentication**: Built-in user management and JWT tokens
- **Admin UI**: Web-based admin interface
- **File Storage**: Built-in file upload and management

### PocketBase Data Directory

The `pb_data/` directory contains:

- `data.db` - Main SQLite database
- `auxiliary.db` - Auxiliary database for logs and sessions
- `types.d.ts` - Generated TypeScript types for your collections

### PocketBase Configuration

- **Port**: Default port 8090 (configurable)
- **Admin**: Access admin UI at `http://localhost:8090/_/`
- **API**: REST API available at `http://localhost:8090/api/`

### Using PocketBase in Your Code

```typescript
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '@lib/pocketbase/types';

const pb = new PocketBase('http://localhost:8090') as TypedPocketBase;

// Example: Create a record
const record = await pb.collection('users').create({
    name: 'John Doe',
    email: 'john@example.com',
});
```

## Project Structure

```
src/
├── index.ts              # Application entry point
├── trpc.ts               # tRPC configuration
├── env.ts                # Environment validation
└── routers/
    ├── appRouter.ts      # Main router combining all sub-routers
    ├── health/           # Health check router
    │   ├── healthRouter.ts
    │   └── healthRouter.test.ts
    └── users/            # User management router
        ├── usersRouter.ts
        └── userSchema.ts
```

## Contributing

1. Follow the existing code patterns and structure
2. Add tests for new functionality
3. Ensure all linting rules pass
4. Update documentation as needed
5. Use conventional commit messages

## License

MIT
