import { describe, it, expect } from 'vitest';
import { appRouter } from './index';

describe('Health Check Route', () => {
    it('should return healthy status with timestamp and uptime', async () => {
        const caller = appRouter.createCaller({});
        const result = await caller.health();

        expect(result).toHaveProperty('status', 'healthy');
        expect(result).toHaveProperty('timestamp');
        expect(result).toHaveProperty('uptime');
        expect(typeof result.timestamp).toBe('string');
        expect(typeof result.uptime).toBe('number');
        expect(result.uptime).toBeGreaterThanOrEqual(0);

        // Verify timestamp is a valid ISO string
        expect(() => new Date(result.timestamp)).not.toThrow();
    });

    it('should return different timestamps on subsequent calls', async () => {
        const caller = appRouter.createCaller({});

        const result1 = await caller.health();
        // Longer delay to ensure different timestamps
        await new Promise((resolve) => setTimeout(resolve, 10));
        const result2 = await caller.health();

        expect(result1.timestamp).not.toBe(result2.timestamp);
        expect(result2.uptime).toBeGreaterThanOrEqual(result1.uptime);
    });
});
