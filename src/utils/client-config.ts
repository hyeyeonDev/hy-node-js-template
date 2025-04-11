// src/utils/config.ts
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export interface ClientConfig {
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionLimit: number;
  };
  schema: string;
  httpPort?: number;
  mqttBroker?: string;
  udpPort?: number;
  tcpPort?: number;
}

export function loadClientConfig(clientId: string): ClientConfig {
  const configPath = path.join(__dirname, '../../config', 'clients.json');
  let clientsConfig: { [key: string]: Partial<ClientConfig> };
  try {
    const configData = fs.readFileSync(configPath, 'utf-8');
    clientsConfig = JSON.parse(configData);
  } catch (err) {
    console.error(`[Config Load Error] Failed to load clients.json:`, err);
    throw new Error('Clients config file not found or invalid');
  }

  const prefix = clientId.toUpperCase().replace('-', '_');

  const dbConfig = {
    host: process.env[`${prefix}_DB_HOST`] || 'localhost',
    port: parseInt(process.env[`${prefix}_DB_PORT`] || '3306', 10),
    user: process.env[`${prefix}_DB_USER`] || 'root',
    password: process.env[`${prefix}_DB_PASSWORD`] || '',
    database: process.env[`${prefix}_DB_NAME`] || `${clientId}_db`,
    connectionLimit: parseInt(process.env[`${prefix}_DB_CONNECTION_LIMIT`] || '10', 10),
  };

  const fileConfig = clientsConfig[clientId] || {};

  return {
    database: dbConfig,
    schema: process.env[`${prefix}_SCHEMA`] || clientId,
    httpPort: fileConfig.httpPort || parseInt('', 10),
    mqttBroker: fileConfig.mqttBroker || 'mqtt://broker:1883',
    udpPort: fileConfig.udpPort || parseInt('', 10),
    tcpPort: fileConfig.tcpPort || parseInt('', 10),
  };
}
