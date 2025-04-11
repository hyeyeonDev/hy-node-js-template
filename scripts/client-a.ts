// scripts/client-a.ts
import { startServers } from '@/src/utils/server-factory';
import { Database } from '@/src/configs/db.config';
import { loadClientConfig } from '@/src/utils/client-config';

async function startClientA() {
  const clientId = 'client-a';
  const config = loadClientConfig(clientId);

  const db = Database.getInstance(clientId, config.database);
  const isHealthy = await db.checkHealth();
  if (!isHealthy) {
    console.error('Database health check failed for Client A');
    process.exit(1);
  }

  await startServers(config);
}

startClientA().catch((error) => {
  console.error('Client A server error:', error);
  process.exit(1);
});
