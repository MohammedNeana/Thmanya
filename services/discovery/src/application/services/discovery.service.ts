import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { IDiscoveryRepository } from '../../domain/repositories/discovery.repository.interface';
import { SearchProgramDto } from '../../presentation/dto/search-program.dto';

@Injectable()
export class DiscoveryService {
    constructor(
        @Inject('IDiscoveryRepository')
        private discoveryRepository: IDiscoveryRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    async searchPrograms(searchProgramDto: SearchProgramDto) {
        const { query, category, page = 1, limit = 10 } = searchProgramDto;
        const cacheKey = `search:${query || 'all'}:${category || 'all'}:${page}:${limit}`;

        const cachedResult = await this.cacheManager.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        const result = await this.discoveryRepository.searchPrograms(query || '', { category, page, limit });

        await this.cacheManager.set(cacheKey, result, 60000);
        return result;
    }

    async getProgram(id: string) {
        const cacheKey = `program:${id}`;
        const cachedProgram = await this.cacheManager.get(cacheKey);

        if (cachedProgram) {
            return cachedProgram;
        }

        const program = await this.discoveryRepository.findProgramById(id);
        if (!program) {
            throw new NotFoundException(`Program with ID ${id} not found`);
        }

        await this.cacheManager.set(cacheKey, program, 300000);
        return program;
    }

    async getProgramEpisodes(programId: string, page: number, limit: number) {
        const cacheKey = `program:${programId}:episodes:${page}:${limit}`;
        const cachedResult = await this.cacheManager.get(cacheKey);

        if (cachedResult) {
            return cachedResult;
        }

        const result = await this.discoveryRepository.getProgramEpisodes(programId, page, limit);

        await this.cacheManager.set(cacheKey, result, 300000);
        return result;
    }
}
