export interface MongoDbConfig {
  ip: string;
  port: number;
  user?: string;
  pass?: string;
  database: string;
}
