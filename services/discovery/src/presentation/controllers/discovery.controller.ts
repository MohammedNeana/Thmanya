import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DiscoveryService } from '../../application/services/discovery.service';
import { SearchProgramDto } from '../dto/search-program.dto';
import { GetEpisodesDto } from '../dto/get-episodes.dto';

@ApiTags('Discovery')
@Controller('discovery')
export class DiscoveryController {
    constructor(private readonly discoveryService: DiscoveryService) { }

    @Get('programs')
    @ApiOperation({ summary: 'Search programs' })
    @ApiResponse({ status: 200, description: 'List of programs' })
    searchPrograms(@Query() query: SearchProgramDto) {
        return this.discoveryService.searchPrograms(query);
    }

    @Get('programs/:id')
    @ApiOperation({ summary: 'Get program details' })
    @ApiResponse({ status: 200, description: 'Program details' })
    getProgram(@Param('id') id: string) {
        return this.discoveryService.getProgram(id);
    }

    @Get('programs/:id/episodes')
    @ApiOperation({ summary: 'Get program episodes' })
    @ApiResponse({ status: 200, description: 'List of episodes for the program' })
    getProgramEpisodes(
        @Param('id') id: string,
        @Query() query: GetEpisodesDto
    ) {
        const { page = 1, limit = 20 } = query;
        return this.discoveryService.getProgramEpisodes(id, page, limit);
    }
}
