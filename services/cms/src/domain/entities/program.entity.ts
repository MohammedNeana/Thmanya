import { Episode } from './episode.entity';

export class Program {
    public id: string;
    public title: string;
    public description: string;
    public category: string;
    public language: string;
    public createdAt: Date;
    public updatedAt: Date;
    public thumbnailUrl?: string;
    public episodes?: Episode[];

    constructor(props: {
        id: string;
        title: string;
        description: string;
        category: string;
        language: string;
        createdAt: Date;
        updatedAt: Date;
        thumbnailUrl?: string;
        episodes?: Episode[];
    }) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.category = props.category;
        this.language = props.language;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
        this.thumbnailUrl = props.thumbnailUrl;
        this.episodes = props.episodes;
    }
}
