import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import databaseConfig from './config/database.config';
import enviromentValidation from './config/enviroment.validation';
import { IDatabase } from './interface/IDatabase';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `.env.${ENV}`,
      validationSchema: enviromentValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Opción #1
      useFactory: (config: ConfigService) => {
        const db: IDatabase = {
          autoLoadEntities: config.get<boolean>('database.autoLoadEntities'),
          synchronize: config.get<boolean>('database.synchronize'),
          migrationsRun: false,
          migrations: ['dist/migrations/*.js'],
        };

        console.log(ENV);
        if (ENV === 'production') {
          // Vercel cambia el nombre de la variable de entorno
          db.url = config.get<string>('database.url');
          db.ssl = { rejectUnauthorized: false };
        } else {
          ((db.username = config.get<string>('database.username')),
            (db.password = config.get<string>('database.password')),
            (db.host = config.get<string>('database.host')),
            (db.database = config.get<string>('database.database')));
        }
        return {
          type: 'postgres',
          ...db,
        };
      },

      // Opción #2
      // useFactory: (db: ConfigType<typeof databaseConfig>) => ({
      //   type: 'postgres',
      //   autoLoadEntities: !!db.autoLoadEntities,
      //   synchronize: !!db.synchronize,
      //   port: parseInt(db.port || '5432'),
      //   username: db.username,
      //   password: db.password,
      //   host: db.host,
      //   database: db.database,
      // }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
