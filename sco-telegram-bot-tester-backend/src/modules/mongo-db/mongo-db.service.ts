import { Inject, Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { MongoDbConfig } from './mongo-db-config';

@Injectable()
export class MongoDbService {

  private _dbConnection: mongoose.Connection & Promise<mongoose.Connection>;

  constructor(@Inject('CONFIG_OPTIONS') private options: MongoDbConfig) {
    if (!this.options) {
      console.error('[MongoDbService] Unnable to get options for init connection');
      throw new Error('MongoDB Unnable to get options for init connection');
    }

    this.createConnectionDB(this.options);
  }

  async createConnectionDB(options: MongoDbConfig) {
    let url = `mongodb://${options.ip}:${options.port}/${options.database}`;
    if (options.user && options.pass) {
      url = `mongodb://${options.user}:${options.pass}@${options.ip}:${options.port}/${options.database}?authSource=admin`;
    }

    this._dbConnection = mongoose.createConnection(url, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      autoCreate: false,
      autoIndex: false,
    });

    this._dbConnection.once('open', () => {
      console.log(`[createConnectionDB] Connected to ${options.database} successfully`);
    });

    this._dbConnection.on('error', () => {
      console.error(`[createConnectionDB] Error connecting to ${options.database}`);
    });
  }

  getConnection(): mongoose.Connection & Promise<mongoose.Connection> {
    return this._dbConnection;
  }
}
