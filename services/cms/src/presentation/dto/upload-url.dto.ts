import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UploadUrlDto {
    @ApiProperty({
        example: 'video/mp4',
        description: 'MIME type of the file to upload. For videos: video/mp4 etc... , For images: image/jpeg, image/png etc...',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    contentType: string;
}
