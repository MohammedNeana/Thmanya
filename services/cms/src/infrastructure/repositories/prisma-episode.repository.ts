import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IEpisodeRepository } from '../../domain/repositories/episode.repository.interface';
import { Episode } from '../../domain/entities/episode.entity';

@Injectable()
export class PrismaEpisodeRepository implements IEpisodeRepository {
    constructor(private prisma: PrismaService) { }

    async createEpisode(programId: string, data: { title: string; description?: string; duration: number; publishedAt?: string; videoUrl?: string; thumbnailUrl?: string; order?: number; isPublished?: boolean }): Promise<Episode> {
        const episode = await this.prisma.episode.create({
            data: {
                ...data,
                programId,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : (data.isPublished ? new Date() : null),
                order: data.order || 0,
                isPublished: data.isPublished || false,
            },
        });
        return this.mapToEpisode(episode);
    }

    async updateEpisode(id: string, data: Partial<{ title: string; description: string; duration: number; publishedAt: string; videoUrl: string; thumbnailUrl: string; order: number; isPublished: boolean }>): Promise<Episode> {
        const episode = await this.prisma.episode.update({
            where: { id },
            data: {
                ...data,
                publishedAt: data.publishedAt ? new Date(data.publishedAt) : undefined
            }
        });
        return this.mapToEpisode(episode);
    }

    async deleteEpisode(id: string): Promise<void> {
        await this.prisma.episode.delete({ where: { id } });
    }

    async findEpisodeById(id: string): Promise<Episode | null> {
        const episode = await this.prisma.episode.findUnique({ where: { id } });
        return episode ? this.mapToEpisode(episode) : null;
    }

    async findEpisodesByProgramId(programId: string): Promise<Episode[]> {
        const episodes = await this.prisma.episode.findMany({
            where: { programId },
            orderBy: { order: 'asc' }
        });
        return episodes.map(e => this.mapToEpisode(e));
    }

    private mapToEpisode(data: any): Episode {
        return new Episode({
            id: data.id,
            title: data.title,
            description: data.description,
            duration: data.duration,
            publishedAt: data.publishedAt,
            programId: data.programId,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            videoUrl: data.videoUrl,
            thumbnailUrl: data.thumbnailUrl,
            order: data.order,
            isPublished: data.isPublished
        });
    }
}
