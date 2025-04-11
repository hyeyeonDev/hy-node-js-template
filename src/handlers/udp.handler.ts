import dgram from 'dgram';
import { udpRouter } from '@/src/routers/udp.router';

export async function udp_init({ port, schema }: { port: number; schema: string }) {
  const server = dgram.createSocket('udp4');

  server.on('message', async (msg, rinfo) => {
    try {
      const hexString = msg.toString('hex');
      const result = await udpRouter(schema, hexString);
      if (result.success) {
        console.log(`[UDP] Data saved for schema ${schema} from ${rinfo.address}:${rinfo.port}`);
      } else {
        console.error(`[UDP] Failed to save data for schema ${schema}: ${result.error}`);
      }
    } catch (err) {
      console.error('[UDP] Error processing message:', err);
    }
  });

  server.on('error', (err) => {
    console.error(`[UDP] Server error for port ${port}:`, err);
  });

  server.on('listening', () => {
    console.log(`[UDP] Listening on port ${port} for schema ${schema}`);
  });

  server.bind(port, () => {
    console.log(`[UDP] Listening on port ${port}`);
  });
}
