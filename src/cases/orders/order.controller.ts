import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order";
import { UpdateOrderStatusDto } from "./dto/update-order-status";
import { Order } from "./entities/order-entity";

@Controller('orders')
export class OrderController {

    constructor(
        private readonly service: OrderService
    ){}

    @Post()
    create(@Body() dto: CreateOrderDto): Promise<Order>{
        return this.service.create(dto);
    }

    @Get()
    findAll(): Promise<Order[]>{
        return this.service.findAll();
    }

    @Get(':id') 
    findOne(@Param('id, ParseUUIDPipe') id: string): Promise<Order>{
        return this.service.findOne(id);
    }

    @Patch(':id/status') // diferença entre patch e put: patch atualiza um recurso, put atualiza um recurso inteiro
    updateStatus(
        @Param('id, ParseUUIDPipe') id: string,
        @Body() dto: UpdateOrderStatusDto
    ): Promise<Order>{
        return this.service.updateStatus(id, dto);
    }

}