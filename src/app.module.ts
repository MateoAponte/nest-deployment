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

        return {
          type: 'postgres',
          autoLoadEntities: true,
          url: 'postgresql://neondb_owner:npg_86RtZDbCwGaK@ep-flat-sea-ah78bmwl.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
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
