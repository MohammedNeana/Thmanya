import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { PrismaModule } from './prisma/prisma.module';
import { DiscoveryService } from './application/services/discovery.service';
import { DiscoveryController } from './presentation/controllers/discovery.controller';
import { PrismaDiscoveryRepository } from './infrastructure/repositories/prisma-discovery.repository';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async () => ({
                store: await redisStore({
                    socket: {
                        host: process.env.REDIS_HOST || 'localhost',
                        port: 6379,
                    },
                }),
            }),
        }),
        PrismaModule,
    ],
    controllers: [DiscoveryController],
    providers: [
        DiscoveryService,
        {
            provide: 'IDiscoveryRepository',
            useClass: PrismaDiscoveryRepository,
        },
    ],
})
export class AppModule { }
