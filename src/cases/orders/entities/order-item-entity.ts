import { Product } from "src/cases/products/product.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order-entity";

@Entity('order_item') // isso é uma anotação do TypeORM que indica que essa classe é uma entidade do banco de dados, e o nome da tabela é 'order_item'
export class OrderItem{

    @PrimaryGeneratedColumn('uuid') // isso é uma anotação do TypeORM que indica que esse campo é a chave primária da tabela, e que o valor será gerado automaticamente como um UUID
    id: string; //id do item do pedido

    @ManyToOne(() => Order, { nullable: false, onDelete: 'CASCADE' }) // indica que esse campo é uma relação muitos-para-um com a entidade Order, e que não pode ser nulo e o onDelete: 'CASCADE' indica que se o pedido for deletado, todos os itens do pedido também serão deletados
    @JoinColumn({ name: 'order_id' }) // indica que o nome da coluna que vai armazenar o id do pedido na tabela order_item é 'order_id'
    order: Order; //pedido do item do pedido, isso faz referencia a instancia alocada na memoria, e nao ao id do pedido, que é um campo da tabela inteira

    @ManyToOne(() => Product, { nullable: false }) // indica que esse campo é uma relação muitos-para-um com a entidade Product, e que não pode ser nulo
    @JoinColumn({ name: 'product_id' }) // indica que o nome da coluna que vai armazenar o id do produto na tabela order_item é 'product_id'
    product : Product; //produto do item do pedido, isso faz referencia a instancia alocada na memoria, e nao ao id do produto, que é um campo da tabela inteira
    
    @Column({ type: 'integer'}) // indica que esse campo é uma coluna da tabela, e que o tipo dela é inteiro
    quantity: number; //quantidade do item do pedido
    
    @Column({ type: 'numeric', precision: 10, scale: 2 }) //  que indica que esse campo é uma coluna da tabela, e que o tipo dela é decimal
    price: number; //preco do item do pedido
    
    @Column({ type: 'numeric', precision: 10, scale: 2 }) // isso é uma anotação do TypeORM que indica que esse campo é uma coluna da tabela, e que o tipo dela é decimal
    subtotal: number; //subtotal do item do pedido, que é o preco multiplicado pela quantidade
}