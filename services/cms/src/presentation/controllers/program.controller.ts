import { Controller, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { ProgramService } from '../../application/services/program.service';
import { CreateProgramDto } from '../dto/create-program.dto';
import { UpdateProgramDto } from '../dto/update-program.dto';
import { UploadUrlDto } from '../dto/upload-url.dto';
import { ApiKeyGuard } from '../../guards/api-key.guard';

@ApiTags('CMS - Programs')
@ApiHeader({
    name: 'x-api-key',
    description: 'API Key for CMS access',
})
@UseGuards(ApiKeyGuard)
@Controller('cms/programs')
export class ProgramController {
    constructor(private readonly programService: ProgramService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new program' })
    @ApiResponse({ status: 201, description: 'The program has been successfully created.' })
    createProgram(@Body() createProgramDto: CreateProgramDto) {
        return this.programService.createProgram(createProgramDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update program metadata' })
    updateProgram(@Param('id') id: string, @Body() updateProgramDto: UpdateProgramDto) {
        return this.programService.updateProgram(id, updateProgramDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a program' })
    deleteProgram(@Param('id') id: string) {
        return this.programService.deleteProgram(id);
    }

    @Post(':id/upload-thumbnail')
    @ApiOperation({ summary: 'Get upload URL for program thumbnail' })
    getProgramThumbnailUploadUrl(@Param('id') id: string, @Body() uploadUrlDto: UploadUrlDto) {
        return this.programService.getProgramThumbnailUploadUrl(id, uploadUrlDto.contentType);
    }
}
