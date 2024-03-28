import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './config';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  url: config.dbURI,
  entities: [__dirname + '/entity/**/*{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsRun: false, // migrations should run as init container before app starts
  synchronize: false,
  logging: false,
};

export const AppDataSource = new DataSource(dataSourceOptions);
