import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";

export const typeOrmAsyncOption: TypeOrmModuleAsyncOptions = {
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow('DATABASE_URL_DOCKER'),
        autoLoadEntities: true,
        synchronize: true, //true for test
    })
}