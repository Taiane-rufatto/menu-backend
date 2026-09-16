import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from './cases/categories/category.module';
import { ProductModule } from './cases/products/product.module';
import { SpotModule } from './cases/spots/spot.module';
import { GuestCheckModule } from './cases/guest-checks/guest-check.module';
import { OrderModule } from './cases/orders/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const dbSchema = configService.get<string>('DATABASE_SCHEMA');

        if (!databaseUrl) {
          throw new Error('A variável de ambiente DATABASE_URL não está definida.');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          schema: dbSchema,
          autoLoadEntities: true,
          synchronize: true,
        }
      }
    }),
    CategoryModule,
    ProductModule,
    SpotModule,
    GuestCheckModule,
    OrderModule
  ],
})
export class AppModule {}
