// src/utils/server-factory.ts
import { express_init } from '@/src/handlers/express.handler';
import { mqtt_init } from '@/src/handlers/mqtt.handler';
import { udp_init } from '@/src/handlers/udp.handler';
import { tcp_init } from '@/src/handlers/tcp.handler';

export interface ServerConfig {
  schema: string;
  httpPort?: number; // HTTP 비활성화 시 undefined
  mqttBroker?: string; // MQTT 비활성화 시 undefined
  udpPort?: number; // UDP 비활성화 시 undefined
  tcpPort?: number; // TCP 비활성화 시 undefined
}

export async function startServers(config: ServerConfig) {
  const { schema } = config;
  const startedServers: string[] = [];

  try {
    // HTTP 서버 초기화
    if (config.httpPort) {
      await express_init({ port: config.httpPort, schema });
      startedServers.push(`HTTP on port ${config.httpPort}`);
    }

    // MQTT 클라이언트 초기화
    if (config.mqttBroker) {
      await mqtt_init({ brokerUrl: config.mqttBroker, schema });
      startedServers.push(`MQTT on ${config.mqttBroker}`);
    }

    // UDP 서버 초기화
    if (config.udpPort) {
      await udp_init({ port: config.udpPort, schema });
      startedServers.push(`UDP on port ${config.udpPort}`);
    }

    // TCP 서버 초기화
    if (config.tcpPort) {
      await tcp_init({ port: config.tcpPort, schema });
      startedServers.push(`TCP on port ${config.tcpPort}`);
    }

    if (startedServers.length === 0) {
      throw new Error('No servers configured to start');
    }

    console.log(`Started servers for schema ${schema}: ${startedServers.join(', ')}`);
  } catch (error) {
    console.error(`Failed to start servers for schema ${schema}:`, error);
    throw error;
  }
}
