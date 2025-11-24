import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { EpisodeService } from '../../application/services/episode.service';
import { CreateEpisodeDto } from '../dto/create-episode.dto';
import { UpdateEpisodeDto } from '../dto/update-episode.dto';
import { UploadUrlDto } from '../dto/upload-url.dto';
import { ApiKeyGuard } from '../../guards/api-key.guard';

@ApiTags('CMS - Episodes')
@ApiHeader({
    name: 'x-api-key',
    description: 'API Key for CMS access',
})
@UseGuards(ApiKeyGuard)
@Controller('cms')
export class EpisodeController {
    constructor(private readonly episodeService: EpisodeService) { }

    @Post('programs/:id/episodes')
    @ApiOperation({ summary: 'Add an episode to a program' })
    addEpisode(@Param('id') id: string, @Body() createEpisodeDto: CreateEpisodeDto) {
        return this.episodeService.addEpisode(id, createEpisodeDto);
    }

    @Get('programs/:id/episodes')
    @ApiOperation({ summary: 'Get all episodes for a program' })
    getEpisodes(@Param('id') id: string) {
        return this.episodeService.getEpisodes(id);
    }

    @Get('episodes/:id')
    @ApiOperation({ summary: 'Get episode by ID' })
    getEpisodeById(@Param('id') id: string) {
        return this.episodeService.getEpisodeById(id);
    }

    @Patch('episodes/:id')
    @ApiOperation({ summary: 'Update episode metadata' })
    updateEpisode(@Param('id') id: string, @Body() updateEpisodeDto: UpdateEpisodeDto) {
        return this.episodeService.updateEpisode(id, updateEpisodeDto);
    }

    @Delete('episodes/:id')
    @ApiOperation({ summary: 'Delete an episode' })
    deleteEpisode(@Param('id') id: string) {
        return this.episodeService.deleteEpisode(id);
    }

    @Post('episodes/:id/upload-video')
    @ApiOperation({ summary: 'Get upload URL for episode video' })
    getEpisodeVideoUploadUrl(@Param('id') id: string, @Body() uploadUrlDto: UploadUrlDto) {
        return this.episodeService.getEpisodeVideoUploadUrl(id, uploadUrlDto.contentType);
    }

    @Post('episodes/:id/upload-thumbnail')
    @ApiOperation({ summary: 'Get upload URL for episode thumbnail' })
    getEpisodeThumbnailUploadUrl(@Param('id') id: string, @Body() uploadUrlDto: UploadUrlDto) {
        return this.episodeService.getEpisodeThumbnailUploadUrl(id, uploadUrlDto.contentType);
    }

    @Patch('episodes/:id/publish')
    @ApiOperation({ summary: 'Publish or unpublish an episode' })
    publishEpisode(@Param('id') id: string, @Body('isPublished') isPublished: boolean) {
        return this.episodeService.publishEpisode(id, isPublished);
    }
}
