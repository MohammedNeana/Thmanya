import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgramDto {
    @ApiProperty({ example: 'The Morning Show' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'A morning talk show' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'Podcast' })
    @IsString()
    @IsNotEmpty()
    category: string;

    @ApiProperty({ example: 'ar', required: false })
    @IsString()
    @IsOptional()
    language?: string;

    @ApiProperty({ example: 'https://s3.amazonaws.com/', required: false })
    @IsString()
    @IsOptional()
    thumbnailUrl?: string;
}
