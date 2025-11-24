import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IDiscoveryRepository } from '../../domain/repositories/discovery.repository.interface';
import { Program } from '../../domain/entities/program.entity';
import { Episode } from '../../domain/entities/episode.entity';

@Injectable()
export class PrismaDiscoveryRepository implements IDiscoveryRepository {
    constructor(private prisma: PrismaService) { }

    async searchPrograms(query: string, filters: { category?: string; page: number; limit: number }): Promise<{ programs: Program[]; total: number }> {
        const { category, page, limit } = filters;
        const skip = (page - 1) * limit;

        const where: any = {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ],
            episodes: {
                some: {
                    isPublished: true
                }
            }
        };

        if (category) {
            where.category = category;
        }

        const [programs, total] = await Promise.all([
            this.prisma.program.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { episodes: { where: { isPublished: true }, orderBy: { order: 'asc' } } },
            }),
            this.prisma.program.count({ where }),
        ]);

        return {
            programs: programs.map(this.toProgram),
            total,
        };
    }

    async findProgramById(id: string): Promise<Program | null> {
        const program = await this.prisma.program.findUnique({
            where: { id },
            include: {
                episodes: {
                    where: { isPublished: true },
                    orderBy: { order: 'asc' },
                    take: 20,
                },
            },
        });
        return program ? this.toProgram(program) : null;
    }

    async getProgramEpisodes(programId: string, page: number, limit: number): Promise<{ episodes: Episode[]; total: number }> {
        const skip = (page - 1) * limit;

        const [episodes, total] = await Promise.all([
            this.prisma.episode.findMany({
                where: {
                    programId,
                    isPublished: true,
                },
                skip,
                take: limit,
                orderBy: { order: 'asc' },
            }),
            this.prisma.episode.count({
                where: {
                    programId,
                    isPublished: true,
                },
            }),
        ]);

        return {
            episodes: episodes.map(this.toEpisode),
            total,
        };
    }

    private toEpisode(data: any): Episode {
        return new Episode({
            id: data.id,
            title: data.title,
            description: data.description || '',
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

    private toProgram(data: any): Program {
        const episodes = data.episodes?.map((e: any) => new Episode({
            id: e.id,
            title: e.title,
            description: e.description || '',
            duration: e.duration,
            publishedAt: e.publishedAt,
            programId: e.programId,
            createdAt: e.createdAt,
            updatedAt: e.updatedAt,
            videoUrl: e.videoUrl,
            thumbnailUrl: e.thumbnailUrl,
            order: e.order,
            isPublished: e.isPublished
        }));

        return new Program({
            id: data.id,
            title: data.title,
            description: data.description,
            category: data.category,
            language: data.language,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            thumbnailUrl: data.thumbnailUrl,
            episodes: episodes
        });
    }
}
