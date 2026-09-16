import { Module } from "@nestjs/common";
import { Order } from "./entities/order-entity";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderItem } from "./entities/order-item-entity";
import { Product } from "../products/product.entity";
import { GuestCheck } from "../guest-checks/guest-check.entity";
import { ProductModule } from "../products/product.module";
import { GuestCheckModule } from "../guest-checks/guest-check.module";

@Module({
  imports: [GuestCheckModule, ProductModule, TypeOrmModule.forFeature([GuestCheck, Product, Order, OrderItem])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
