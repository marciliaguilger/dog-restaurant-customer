import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource(
  {   
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [
      'src/infrastructure/entities/*.ts'
    ],
    migrations: [
      'src/infrastructure/migrations/*.ts'
    ],
    subscribers: [
      'src/infrastructure/subscriber/*.ts'
    ],
    synchronize: false,
    logging: true,
    logger: 'advanced-console',
    
  });