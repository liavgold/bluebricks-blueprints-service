import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import { BlueprintsModule } from './blueprints/blueprints.module';
import { Blueprint } from './blueprints/entities/blueprint.entity';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import configuration from './config/configuration';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      },
    }),
    HealthModule,
    MetricsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('database.host'),
        port: configService.getOrThrow<number>('database.port'),
        username: configService.getOrThrow<string>('database.user'),
        password: configService.getOrThrow<string>('database.password'),
        database: configService.getOrThrow<string>('database.name'),
        entities: [Blueprint],
        synchronize: configService.getOrThrow<string>('NODE_ENV') !== 'production',
        logging: configService.getOrThrow<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    BlueprintsModule,
  ],
})
export class AppModule {}
