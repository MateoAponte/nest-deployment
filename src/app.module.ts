import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import databaseConfig from './config/database.config';
import enviromentValidation from './config/enviroment.validation';
import { IDatabase } from './interface/IDatabase';
import { UsersResolver } from './users/users.resolver';
import { PostsResolver } from './posts/posts.resolver';
import { CategoriesResolver } from './categories/categories.resolver';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CategoriesModule } from './categories/categories.module';
import { CategoriesResolver } from './categories/categories.resolver';

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
          ssl: !!config.get<boolean>('database.ssl')
            ? { rejectUnauthorized: false }
            : {},
          username: config.get<string>('database.username'),
          password: config.get<string>('database.password'),
          host: config.get<string>('database.host'),
          database: config.get<string>('database.database'),
        };

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
    CategoriesModule,
    PostsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, UsersResolver, PostsResolver, CategoriesResolver],
})
export class AppModule {}
