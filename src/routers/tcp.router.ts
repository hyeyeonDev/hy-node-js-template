import { NormalizedData } from '@/src/types/data.type';
import { DataController } from '@/src/controllers/data.controller';

export default async function tcpRouter(schema: string, strData: string): Promise<void> {
  const data = await dataHandler(schema, strData);
  if (!data) return;

  const controller = new DataController(schema);
  await controller.handleData(data);
}

// 데이터 가공
async function dataHandler(schema: string, strData: string): Promise<NormalizedData | null> {
  let lines = strData.split(';');
  const items = lines.filter(Boolean).map((line) => {
    const [id, value, timestamp] = line.replace('$', '').split('|');
    return { id, value, timestamp };
  });

  if (items.length === 0) return null;

  return { schema, items: items };
}
