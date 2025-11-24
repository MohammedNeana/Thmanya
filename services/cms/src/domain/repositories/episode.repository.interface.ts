import { Episode } from '../entities/episode.entity';

export interface IEpisodeRepository {
    createEpisode(programId: string, data: { title: string; description?: string; duration: number; publishedAt?: string; videoUrl?: string; thumbnailUrl?: string; isPublished?: boolean; order?: number }): Promise<Episode>;
    updateEpisode(id: string, data: Partial<{ title: string; description: string; duration: number; publishedAt: string; videoUrl: string; thumbnailUrl: string; isPublished: boolean; order: number }>): Promise<Episode>;
    deleteEpisode(id: string): Promise<void>;
    findEpisodeById(id: string): Promise<Episode | null>;
    findEpisodesByProgramId(programId: string): Promise<Episode[]>;
}
