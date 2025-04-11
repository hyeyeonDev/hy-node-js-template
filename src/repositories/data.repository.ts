import { NormalizedData, NormalizedItem } from '@/src/types/data.type';
import { DataQuery } from '@/src/queries/data.query';
import { query, queryOne } from '@/src/queries/baseQuery';

export class DataRepository {
  private queries: ReturnType<typeof DataQuery>;

  constructor(schema: string) {
    this.queries = DataQuery(schema);
  }

  async findAll(): Promise<NormalizedData[]> {
    return query<NormalizedData>(this.queries.GET_ALL);
  }

  async findById(id: number): Promise<NormalizedItem | null> {
    return queryOne<NormalizedItem>(this.queries.GET_BY_ID, [id]);
  }

  async bulkCreate(data: NormalizedData): Promise<void> {
    const { items } = data;
    const values = items.map(({ id, value, timestamp }) => [id, value, timestamp]);
    if (values.length === 0) return;

    await query(this.queries.BULK_INSERT, [values]);
  }

  async update(id: number, name: string): Promise<void> {
    await query(this.queries.UPDATE, [name, id]);
  }

  async delete(id: number): Promise<void> {
    await query(this.queries.DELETE, [id]);
  }
}
