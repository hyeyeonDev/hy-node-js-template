// scripts/client-b.ts
import { startServers } from '@/src/utils/server-factory';
import { Database } from '@/src/configs/db.config';
import { loadClientConfig } from '@/src/utils/client-config';

async function startClientB() {
  const clientId = 'client-b';
  const config = loadClientConfig(clientId);

  const db = Database.getInstance(clientId, config.database);
  const isHealthy = await db.checkHealth();
  if (!isHealthy) {
    console.error('Database health check failed for Client B');
    process.exit(1);
  }

  await startServers(config);
}

startClientB().catch((error) => {
  console.error('Client B server error:', error);
  process.exit(1);
});
