import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto, CreateOrderItemDto } from "./dto/create-order";
import { Order, OrderStatus } from "./entities/order-entity";
import { GuestCheckService } from "../guest-checks/guest-check.service";
import { OrderItem } from "./entities/order-item-entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductService } from "../products/product.service";
import { UpdateOrderStatusDto } from "./dto/update-order-status";

@Injectable() // aqui estamos dizendo que a classe OrderService é um serviço do NestJS, e que pode ser injetada em outros lugares do código, como por exemplo em um controller.
export class OrderService { // aqui estamos dizendo que a classe OrderService é um serviço do NestJS, e que pode ser injetada em outros lugares do código, como por exemplo em um controller.
    constructor(
        private readonly guestCheckService: GuestCheckService,// aqui estamos dizendo que a classe OrderService depende da classe GuestCheckService, e que o NestJS deve injetar uma instância dela no construtor da classe OrderService
        private readonly productService : ProductService,
       
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>
    ){} 


    private async prepareItems(dto: CreateOrderItemDto): Promise<OrderItem>{
        const product = await this.productService.findOne(dto.productId);
        const subtotal = dto.quantity * product.price;

        return this.orderItemRepository.create({
            product,
            quantity: dto.quantity,
            price: product.price,
            subtotal
        });
    }
    
     

    async create(dto: CreateOrderDto): Promise<Order>{

        // regra #1: Verificar se tem comanda aberta para a mesa (spotId)
        const guestCheck = await this.guestCheckService.findOrcCreateOpened(dto.spotId); 

        // Monta o totalizador do pedido
        const items: OrderItem[] = [];
        let total = 0; 

        for (const itemDto of dto.items){
            const item = await this.prepareItems(itemDto); // prepara para inserir no banco
            items.push(item);
            total += Number(item.subtotal)
        }

        // Monta o pedido
        const order = this.orderRepository.create({
            guestCheck,
            status: OrderStatus.NEW,
            total,
            items
        })

        // gravar no banco o pedido
        return this.orderRepository.save(order);
    } 

    // traz o pedido junto com os itens (e o produto de cada item) e a comanda (com a mesa)
    findAll(): Promise<Order[]>{
        return this.orderRepository.find({
            relations: { items: { product: true }, guestCheck: { spot: true } },
            order: { createdAt: 'ASC' },
        });
    }

    async findOne(id: string): Promise<Order> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: { items: { product: true }, guestCheck: { spot: true } },
        });

        if (!order) {
          throw new NotFoundException('Pedido não encontrado');
        }

        return order; 

    }

    async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<Order> {

        const order = await this.findOne(id);

        // As transições são livres: qualquer status pode ir para qualquer outro.
        // A validação de que o status existe no enum é feita no UpdateOrderStatusDto (@IsEnum).

        //forço a mudança de status
        order.status = dto.status

        // gravo a alteração no banco
        return this.orderRepository.save(order); 
    }
}