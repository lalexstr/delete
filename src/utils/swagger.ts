import * as fs from 'fs';
import * as path from 'path';
import { config } from './config';

const openApiPath = path.join(__dirname, '../docs/openapi.json');
const openApiSpec = JSON.parse(fs.readFileSync(openApiPath, 'utf8'));

openApiSpec.servers = [
  {
    url: `http://localhost:${config.port}`,
    description: 'Development server',
  },
];

export const swaggerSpec = openApiSpec;
