// scripts/client-c.ts
import { startServers } from '@/src/utils/server-factory';
import { Database } from '@/src/configs/db.config';
import { loadClientConfig } from '@/src/utils/client-config';

async function startClientC() {
  const clientId = 'client-c';
  const config = loadClientConfig(clientId);

  const db = Database.getInstance(clientId, config.database);
  const isHealthy = await db.checkHealth();
  if (!isHealthy) {
    console.error('Database health check failed for Client C');
    process.exit(1);
  }

  await startServers(config);
}

startClientC().catch((error) => {
  console.error('Client C server error:', error);
  process.exit(1);
});
