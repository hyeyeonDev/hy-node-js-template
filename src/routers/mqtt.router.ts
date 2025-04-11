import { NormalizedData } from '@/src/types/data.type';
import { DataController } from '@/src/controllers/data.controller';

export async function mqttRouter(schema: string, hexString: string): Promise<void> {
  const data = dataHandler(schema, hexString);
  if (!data) return;
  const controller = new DataController(schema);
  await controller.handleData(data);
}

// 데이터 가공
function dataHandler(schema: string, hexString: string): NormalizedData | null {
  // (16진수 잘라내기) Hexadecimal Truncate
  let byteArray = hexString.replace(/\B(?=(.{2})+(?!.))/g, ',').split(',');
  const items = byteArray.filter(Boolean).map((line) => {
    const [id, value, timestamp] = line.replace('$', '').split('|');
    return { id, value, timestamp };
  });

  if (items.length === 0) return null;

  return { schema, items: items };
}
