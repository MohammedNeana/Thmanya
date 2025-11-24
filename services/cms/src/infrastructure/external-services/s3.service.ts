import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
    private s3Client: S3Client;
    private bucketName: string;

    constructor(private configService: ConfigService) {
        const region = this.configService.get<string>('AWS_REGION');
        const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
        const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
        this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

        if (!region || !accessKeyId || !secretAccessKey || !this.bucketName) {
            console.warn('AWS credentials or bucket name not found in environment variables');
        }

        this.s3Client = new S3Client({
            region: region || 'us-east-1',
            credentials: {
                accessKeyId: accessKeyId || 'mock',
                secretAccessKey: secretAccessKey || 'mock',
            },
        });
    }

    async getPresignedUrl(key: string, contentType: string): Promise<string> {
        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: key,
            ContentType: contentType,
        });

        try {
            return await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
        } catch (error) {
            console.error('Error generating pre-signed URL:', error);
            throw new InternalServerErrorException('Could not generate upload URL');
        }
    }
}
