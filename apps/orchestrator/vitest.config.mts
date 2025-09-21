import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        clearMocks: true,
        environment: 'node',
        globals: true,
        watch: false,
    },
});
