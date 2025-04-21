// src/lib/server/rateLimiter.ts
/**
 * Simple in-memory rate limiter
 * Note: For production use, consider using Redis or similar for distributed rate limiting
 */

interface RateLimitRecord {
    count: number;
    resetAt: number;
}

export function createRateLimiter(limit: number, windowMs: number) {
const records = new Map<string, RateLimitRecord>();

// Clean up expired records every minute
setInterval(() => {
    const now = Date.now();
    for (const [key, record] of records.entries()) {
    if (now > record.resetAt) {
        records.delete(key);
    }
    }
}, 60000);

return {
    // Check if the key can make another request
    check(key: string): boolean {
    const now = Date.now();
    const record = records.get(key);

    if (!record) {
        return true;
    }

    // If the window has expired, reset the counter
    if (now > record.resetAt) {
        records.set(key, {
        count: 0,
        resetAt: now + windowMs
        });
        return true;
    }

    // Otherwise, check if we're under the limit
    return record.count < limit;
    },

    // Increment the counter for a key
    increment(key: string): void {
    const now = Date.now();
    const record = records.get(key);

    if (!record) {
        records.set(key, {
        count: 1,
        resetAt: now + windowMs
        });
        return;
    }

    // If the window has expired, reset the counter
    if (now > record.resetAt) {
        records.set(key, {
        count: 1,
        resetAt: now + windowMs
        });
        return;
    }

    // Otherwise, increment the counter
    record.count += 1;
    },

    // Reset a specific key
    reset(key: string): void {
    records.delete(key);
    }
};
}