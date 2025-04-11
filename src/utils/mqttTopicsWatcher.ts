import { readFileSync, watch, existsSync, statSync } from 'fs';
import path from 'path';

// Define the expected structure of the JSON data
interface DbGatewayMap {
  [key: string]: string[]; // Database name maps to an array of gateway IDs
}

const filePath: string = path.join(process.cwd(), 'mqttTopics.json');

// Function to load the dbGatewayMap
export const loadDbGatewayMap = (schema: string): string[] => {
  const db: string = schema.toLowerCase();

  try {
    // Check if file exists
    if (!existsSync(filePath)) {
      console.error('The file does not exist.');
      return [];
    }

    const data: string = readFileSync(filePath, 'utf-8');

    // Check if file is empty
    if (!data) {
      console.error('The file is empty.');
      return [];
    }

    const parsedData: DbGatewayMap = JSON.parse(data);
    return parsedData[db] || [];
  } catch (error) {
    console.error('Error loading database gateway mapping:', error);
    return [];
  }
};

// Watch for changes in the JSON file
export const watchFileForChanges = (schema: string, callback: (gatewayIds: string[]) => void): void => {
  watch(filePath, (eventType: string) => {
    if (eventType === 'change') {
      console.log(`${filePath} has been modified, reloading...`);
      const newGwIds: string[] = loadDbGatewayMap(schema);
      callback(newGwIds);
    }
  });
};
