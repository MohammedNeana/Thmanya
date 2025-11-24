import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IEpisodeRepository } from '../../domain/repositories/episode.repository.interface';
import { IProgramRepository } from '../../domain/repositories/program.repository.interface';
import { CreateEpisodeDto } from '../../presentation/dto/create-episode.dto';
import { UpdateEpisodeDto } from '../../presentation/dto/update-episode.dto';
import { S3Service } from '../../infrastructure/external-services/s3.service';

@Injectable()
export class EpisodeService {
    constructor(
        @Inject('IEpisodeRepository')
        private episodeRepository: IEpisodeRepository,
        @Inject('IProgramRepository')
        private programRepository: IProgramRepository,
        private s3Service: S3Service,
    ) { }

    async addEpisode(programId: string, createEpisodeDto: CreateEpisodeDto) {
        const program = await this.programRepository.findProgramById(programId);
        if (!program) {
            throw new NotFoundException(`Program with ID ${programId} not found`);
        }
        return this.episodeRepository.createEpisode(programId, createEpisodeDto);
    }

    async updateEpisode(id: string, updateEpisodeDto: UpdateEpisodeDto) {
        const episode = await this.episodeRepository.findEpisodeById(id);
        if (!episode) {
            throw new NotFoundException(`Episode with ID ${id} not found`);
        }
        return this.episodeRepository.updateEpisode(id, updateEpisodeDto);
    }

    async deleteEpisode(id: string) {
        const episode = await this.episodeRepository.findEpisodeById(id);
        if (!episode) {
            throw new NotFoundException(`Episode with ID ${id} not found`);
        }
        return this.episodeRepository.deleteEpisode(id);
    }

    async getEpisodeVideoUploadUrl(episodeId: string, contentType: string) {
        const episode = await this.episodeRepository.findEpisodeById(episodeId);
        if (!episode) {
            throw new NotFoundException(`Episode with ID ${episodeId} not found`);
        }
        const key = `episodes/${episodeId}/video.${contentType.split('/')[1]}`;
        const url = await this.s3Service.getPresignedUrl(key, contentType);
        return { uploadUrl: url, key };
    }

    async getEpisodeThumbnailUploadUrl(episodeId: string, contentType: string) {
        const episode = await this.episodeRepository.findEpisodeById(episodeId);
        if (!episode) {
            throw new NotFoundException(`Episode with ID ${episodeId} not found`);
        }
        const key = `episodes/${episodeId}/thumbnail.${contentType.split('/')[1]}`;
        const url = await this.s3Service.getPresignedUrl(key, contentType);
        return { uploadUrl: url, key };
    }

    async publishEpisode(episodeId: string, isPublished: boolean) {
        const episode = await this.episodeRepository.findEpisodeById(episodeId);
        if (!episode) {
            throw new NotFoundException(`Episode with ID ${episodeId} not found`);
        }
        return this.episodeRepository.updateEpisode(episodeId, { isPublished });
    }

    async getEpisodes(programId: string) {
        const program = await this.programRepository.findProgramById(programId);
        if (!program) {
            throw new NotFoundException(`Program with ID ${programId} not found`);
        }
        return this.episodeRepository.findEpisodesByProgramId(programId);
    }

    async getEpisodeById(id: string) {
        const episode = await this.episodeRepository.findEpisodeById(id);
        if (!episode) {
            throw new NotFoundException(`Episode with ID ${id} not found`);
        }
        return episode;
    }
}
