import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import KeyvRedis from '@keyv/redis'

export const redisCacheModuleOptions: CacheModuleAsyncOptions = {
    isGlobal: true,
    inject: [ConfigService],
    useFactory: async(cfg: ConfigService) => ({
        stores: [new KeyvRedis(cfg.getOrThrow('REDIS_URL'))],
    })
}