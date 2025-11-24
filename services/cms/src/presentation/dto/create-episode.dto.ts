import { IsString, IsOptional, IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEpisodeDto {
    @ApiProperty({ example: 'Episode 1: New Beginnings' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'In this episode', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 3600, description: 'Duration in seconds' })
    @IsInt()
    @Min(0)
    duration: number;

    @ApiProperty({ example: '2023-10-27T10:00:00Z', required: false })
    @IsString()
    @IsOptional()
    publishedAt?: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/', required: false })
    @IsString()
    @IsOptional()
    videoUrl?: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/', required: false })
    @IsString()
    @IsOptional()
    thumbnailUrl?: string;

    @ApiProperty({ example: true, required: false })
    @IsOptional()
    isPublished?: boolean;

    @ApiProperty({ example: 1, required: false })
    @IsInt()
    @IsOptional()
    order?: number;
}
