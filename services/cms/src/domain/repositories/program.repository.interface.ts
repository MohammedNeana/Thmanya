import { Program } from '../entities/program.entity';

export interface IProgramRepository {
    createProgram(data: { title: string; description: string; category: string; language?: string; thumbnailUrl?: string }): Promise<Program>;
    updateProgram(id: string, data: Partial<{ title: string; description: string; category: string; language: string; thumbnailUrl: string }>): Promise<Program>;
    deleteProgram(id: string): Promise<void>;
    findProgramById(id: string): Promise<Program | null>;
}
