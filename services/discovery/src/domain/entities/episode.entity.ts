export class Episode {
    public id: string;
    public title: string;
    public description: string;
    public duration: number;
    public publishedAt: Date | null;
    public programId: string;
    public createdAt: Date;
    public updatedAt: Date;
    public videoUrl?: string;
    public thumbnailUrl?: string;
    public order: number;
    public isPublished: boolean;

    constructor(props: {
        id: string;
        title: string;
        description: string;
        duration: number;
        publishedAt: Date | null;
        programId: string;
        createdAt: Date;
        updatedAt: Date;
        videoUrl?: string;
        thumbnailUrl?: string;
        order?: number;
        isPublished?: boolean;
    }) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.duration = props.duration;
        this.publishedAt = props.publishedAt;
        this.programId = props.programId;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.videoUrl = props.videoUrl;
        this.thumbnailUrl = props.thumbnailUrl;
        this.order = props.order || 0;
        this.isPublished = props.isPublished || false;
    }
}