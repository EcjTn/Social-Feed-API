import { ThrottlerModuleOptions } from "@nestjs/throttler";

// 20 requests every 10s
export const throttlerOptionsSync: ThrottlerModuleOptions = {
    errorMessage: 'You are making requests too quickly. Please wait a few seconds before trying again.',
    throttlers: [{
        ttl: 10_000,
        limit: 20
    }]
} 