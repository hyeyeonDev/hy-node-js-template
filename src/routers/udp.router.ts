import { NormalizedData } from '@/src/types/data.type';
import { DataController } from '@/src/controllers/data.controller';

export async function udpRouter(schema: string, msg: string): Promise<{ success: boolean; error?: string }> {
  const data = dataHandler(schema, msg);
  if (!data) return { success: false, error: 'Invalid or empty data' };

  const controller = new DataController(schema);
  try {
    await controller.handleData(data);
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// 데이터 가공
function dataHandler(schema: string, hexString: string): NormalizedData {
  // (16진수 잘라내기) Hexadecimal Truncate
  let byteArray = hexString.replace(/\B(?=(.{2})+(?!.))/g, ',').split(',');
  const items = byteArray.filter(Boolean).map((line) => {
    const [id, value, timestamp] = line.replace('$', '').split('|');
    return { id, value, timestamp };
  });

  return { schema, items: items };
}
