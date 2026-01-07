import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST') as string,
        port: Number(config.get('POSTGRES_PORT')) || 5432,
        username: config.get('POSTGRES_USER') as string,
        password: config.get('POSTGRES_PASSWORD') as string,
        database: config.get('POSTGRES_DB') as string,
        entities: [], // هنا ممكن تضيف الـ entities الخاصة بك
        synchronize: true,
      }),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
