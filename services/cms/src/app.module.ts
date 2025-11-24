import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ExternalServicesModule } from './infrastructure/external-services/external-services.module';
import { ProgramService } from './application/services/program.service';
import { EpisodeService } from './application/services/episode.service';
import { ProgramController } from './presentation/controllers/program.controller';
import { EpisodeController } from './presentation/controllers/episode.controller';
import { PrismaProgramRepository } from './infrastructure/repositories/prisma-program.repository';
import { PrismaEpisodeRepository } from './infrastructure/repositories/prisma-episode.repository';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        ExternalServicesModule,
    ],
    controllers: [ProgramController, EpisodeController],
    providers: [
        ProgramService,
        EpisodeService,
        {
            provide: 'IProgramRepository',
            useClass: PrismaProgramRepository,
        },
        {
            provide: 'IEpisodeRepository',
            useClass: PrismaEpisodeRepository,
        },
    ],
})
export class AppModule { }
