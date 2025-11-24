import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IProgramRepository } from '../../domain/repositories/program.repository.interface';
import { CreateProgramDto } from '../../presentation/dto/create-program.dto';
import { UpdateProgramDto } from '../../presentation/dto/update-program.dto';
import { S3Service } from '../../infrastructure/external-services/s3.service';

@Injectable()
export class ProgramService {
    constructor(
        @Inject('IProgramRepository')
        private programRepository: IProgramRepository,
        private s3Service: S3Service,
    ) { }

    async createProgram(createProgramDto: CreateProgramDto) {
        return this.programRepository.createProgram(createProgramDto);
    }

    async updateProgram(id: string, updateProgramDto: UpdateProgramDto) {
        const program = await this.programRepository.findProgramById(id);
        if (!program) {
            throw new NotFoundException(`Program with ID ${id} not found`);
        }
        return this.programRepository.updateProgram(id, updateProgramDto);
    }

    async deleteProgram(id: string) {
        const program = await this.programRepository.findProgramById(id);
        if (!program) {
            throw new NotFoundException(`Program with ID ${id} not found`);
        }
        return this.programRepository.deleteProgram(id);
    }

    async getProgramThumbnailUploadUrl(programId: string, contentType: string) {
        const program = await this.programRepository.findProgramById(programId);
        if (!program) {
            throw new NotFoundException(`Program with ID ${programId} not found`);
        }
        const key = `programs/${programId}/thumbnail.${contentType.split('/')[1]}`;
        const url = await this.s3Service.getPresignedUrl(key, contentType);
        return { uploadUrl: url, key };
    }
}
