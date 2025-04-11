import { NormalizedData, NormalizedItem } from '@/src/types/data.type';
import { DataRepository } from '@/src/repositories/data.repository';

export class DataService {
  private dataRepository: DataRepository;

  constructor(schema: string, dataRepository: DataRepository = new DataRepository(schema)) {
    this.dataRepository = dataRepository;
  }

  async getDataList(): Promise<NormalizedData[]> {
    return await this.dataRepository.findAll();
  }

  async getData(id: number): Promise<NormalizedItem | null> {
    return await this.dataRepository.findById(id);
  }

  async registerData(data: NormalizedData): Promise<void> {
    await this.dataRepository.bulkCreate(data);
  }

  async changeDataName(id: number, name: string): Promise<void> {
    await this.dataRepository.update(id, name);
  }

  async removeData(id: number): Promise<void> {
    await this.dataRepository.delete(id);
  }
}
