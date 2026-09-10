import { GuestCheck } from "src/cases/guest-checks/guest-check.entity";
import { OrderItem } from "./order-item-entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum OrderStatus{
    NEW = 'NEW',
    PREPARING = 'PREPARING',
    READY = 'READY',
    DELIVERY = 'DELIVERY',
}

@Entity()
export class Order{
    @PrimaryGeneratedColumn('uuid') //  campo é a chave primária da tabela, e que o valor será gerado automaticamente como um UUID
    id: string;
    
    @CreateDateColumn({ name : 'created_at'}) // indica que esse campo é uma coluna da tabela, e que o valor dela será gerado automaticamente como a data e hora atual, e o nome da coluna será 'created_at'
    createdAt: Date; //java script nao tem tipo date, mas o typescript sim;
    
    @ManyToOne(() => GuestCheck, { nullable: false }) // indica que esse campo é uma relação muitos-para-um com a entidade GuestCheck, e que não pode ser nulo
    @JoinColumn({ name: 'guest_check_id' }) // indica que o nome da coluna que vai armazenar o id do guest check na tabela order é 'guest_check_id'
    guestCheck: GuestCheck; //pelo modelo de banco nao relacional nao vinculamos o campo (id, como no banco relacional), mas sim o objeto inteiro (linha), que contem o id e outros campos do guestCheck e isso faz referencia a instancia alocada na memória // diagarama de classe faz referencia a classe inteira, então o tipo dela vai ser a tabela inteira, e nao o id dela, que é um campo da tabela inteira
    
    @Column({ type: 'numeric', precision: 10, scale: 2 }) // indica que esse campo é uma coluna da tabela, e que o tipo dela é decimal
    total: number;
    
    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW }) // indica que esse campo é uma coluna da tabela, e que o tipo dela é um enum, e que o valor padrão é 'NEW'
    status: OrderStatus; // Isso é um enum, que é um tipo de dado que pode ter um conjunto limitado de valores, e nesse caso, os valores são os status do pedido.
    
    @OneToMany(() => OrderItem, (item) => item.order, {
        cascade: true
    })  
    items: OrderItem[]; // Isso é um array de OrderItem, que é uma classe que representa um item do pedido. Cada item tem um produto, uma quantidade e um preço.

}