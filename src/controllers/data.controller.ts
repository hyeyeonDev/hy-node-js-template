import { NormalizedData, NormalizedItem } from '@/src/types/data.type';
import { DataService } from '@/src/services/data.service';

export class DataController {
  private dataService: DataService;

  constructor(schema: string, dataService: DataService = new DataService(schema)) {
    this.dataService = dataService;
  }

  async handleData(data: NormalizedData): Promise<{ success: boolean; error?: string }> {
    try {
      await this.dataService.registerData(data);
      return { success: true };
    } catch (err) {
      console.error(`[Controller Error] registerData:`, err);
      return { success: false, error: (err as Error).message };
    }
  }

  async getData(id: number): Promise<NormalizedItem | null> {
    return await this.dataService.getData(id); // Add this method
  }
}
