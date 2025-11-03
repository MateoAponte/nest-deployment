export interface IDatabase {
  autoLoadEntities?: boolean | undefined;
  synchronize?: boolean | undefined;
  port?: number | undefined;
  username?: string | undefined;
  password?: string | undefined;
  host?: string | undefined;
  database?: string | undefined;
  url?: string | undefined;
  migrationsRun?: boolean | undefined;
  migrations?: string[] | undefined;
  entities?: string[] | undefined;
  ssl?: { rejectUnauthorized?: boolean } | undefined;
}
