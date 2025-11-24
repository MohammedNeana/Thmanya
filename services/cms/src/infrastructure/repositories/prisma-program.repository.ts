import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IProgramRepository } from '../../domain/repositories/program.repository.interface';
import { Program } from '../../domain/entities/program.entity';
import { Episode } from '../../domain/entities/episode.entity';

@Injectable()
export class PrismaProgramRepository implements IProgramRepository {
    constructor(private prisma: PrismaService) { }

    async createProgram(data: { title: string; description: string; category: string; language?: string; thumbnailUrl?: string }): Promise<Program> {
        const program = await this.prisma.program.create({ data: { ...data, language: data.language || 'en' } });
        return this.mapToProgram(program);
    }

    async updateProgram(id: string, data: Partial<{ title: string; description: string; category: string; language: string; thumbnailUrl: string }>): Promise<Program> {
        const program = await this.prisma.program.update({ where: { id }, data });
        return this.mapToProgram(program);
    }

    async deleteProgram(id: string): Promise<void> {
        await this.prisma.program.delete({ where: { id } });
    }

    async findProgramById(id: string): Promise<Program | null> {
        const program = await this.prisma.program.findUnique({
            where: { id },
            include: {
                episodes: {
                    orderBy: { order: 'asc' }
                }
            }
        });
        return program ? this.mapToProgram(program) : null;
    }

    private mapToProgram(data: any): Program {
        const episodes = data.episodes?.map((e: any) => new Episode({
            id: e.id,
            title: e.title,
            description: e.description,
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
