import { connect, MqttClient } from 'mqtt';
import { mqttRouter } from '@/src/routers/mqtt.router';
import { loadDbGatewayMap, watchFileForChanges } from '@/src/utils/mqttTopicsWatcher';

// 고정된 호스트 (환경변수 또는 config로 분리해도 OK)
const subscribePrefix = '/';

let currentSubscribedTopics: string[] = [];

export async function mqtt_init({ brokerUrl, schema }: { brokerUrl: string; schema: string }): Promise<void> {
  const client: MqttClient = connect(`mqtt://${brokerUrl}`);

  client.on('connect', async () => {
    console.log(`[MQTT] Connected to broker: ${client}`);

    // 초기 토픽 구독
    await updateSubscriptions(client, schema);

    // JSON 파일 변경 감지
    watchFileForChanges(schema, async (newGwIds) => {
      await updateSubscriptions(client, schema);
    });
  });

  client.on('message', (topic: string, message: Buffer) => {
    const hexPayload = message.toString('hex');
    console.log(`[MQTT] Topic: ${topic}, Message (hex): ${hexPayload}`);

    try {
      mqttRouter(schema, hexPayload);
    } catch (error) {
      console.error('[MQTT] Error routing message:', error);
    }
  });

  client.on('error', (err) => {
    console.error('[MQTT] Connection error:', err);
  });
}

const updateSubscriptions = async (client: MqttClient, schema: string): Promise<void> => {
  const gwIds = loadDbGatewayMap(schema);
  const newTopics = gwIds.map((gwId) => `${subscribePrefix}${gwId}`);

  if (JSON.stringify(currentSubscribedTopics) !== JSON.stringify(newTopics)) {
    if (currentSubscribedTopics.length > 0) {
      await unsubscribeFromTopics(client, currentSubscribedTopics);
    }

    await subscribeToTopics(client, newTopics);
    currentSubscribedTopics = newTopics;
  }
};

const subscribeToTopics = (client: MqttClient, topics: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    client.subscribe(topics, undefined, (err) => {
      if (err) {
        console.error('[MQTT] Subscription error:', err);
        reject(err);
      } else {
        console.log(`[MQTT] Subscribed to topics:`, topics);
        resolve();
      }
    });
  });
};

const unsubscribeFromTopics = (client: MqttClient, topics: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    client.unsubscribe(topics, undefined, (err) => {
      if (err) {
        console.error('[MQTT] Unsubscription error:', err);
        reject(err);
      } else {
        console.log(`[MQTT] Unsubscribed from topics:`, topics);
        resolve();
      }
    });
  });
};
