import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GuestCheckController } from "./guest-check.controller";
import { GuestCheckService } from "./guest-check.service";
import { Spot } from "../spots/spot.entity";
import { GuestCheck } from "./guest-check.entity";


@Module({
  imports: [TypeOrmModule.forFeature([Spot, GuestCheck])],
  controllers: [GuestCheckController],
  providers: [GuestCheckService],
  exports: [GuestCheckService] // aqui estamos dizendo que a classe GuestCheckService é um provedor do módulo GuestCheckModule, e que pode ser injetada em outros módulos, como por exemplo no módulo OrderModule, que é o módulo que vai criar os pedidos, e que precisa do serviço de comanda para verificar se a mesa está aberta ou não.
})
export class GuestCheckModule {}
