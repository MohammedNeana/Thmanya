import { Program } from '../entities/program.entity';
import { Episode } from '../entities/episode.entity';

export interface IDiscoveryRepository {
    searchPrograms(query: string, filters: { category?: string; page: number; limit: number }): Promise<{ programs: Program[]; total: number }>;
    findProgramById(id: string): Promise<Program | null>;
    getProgramEpisodes(programId: string, page: number, limit: number): Promise<{ episodes: Episode[]; total: number }>;
}