import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import databaseConfig from './config/database.config';
import enviromentValidation from './config/enviroment.validation';
import { IDatabase } from './interface/IDatabase';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { join } from 'path';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    CategoriesModule,
    PostsModule,
    UsersModule,
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
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          host: config.get<string>('database.host'),
          database: config.get<string>('database.database'),
          migrationsRun: config.get<boolean>('database.migrationsRun'),
          autoLoadEntities: config.get<boolean>('database.autoLoadEntities'),
          synchronize: config.get<boolean>('database.synchronize'),
        };

        if (ENV === 'production') db.ssl = { rejectUnauthorized: true };
        if (ENV === 'dev') db.port = config.get<number>('database.port');

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
