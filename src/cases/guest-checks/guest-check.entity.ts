import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Spot } from '../spots/spot.entity';

export enum GuestCheckStatus {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED'
}

@Entity('guest-check') // aqui estamos dizendo que a classe GuestCheck é uma tabela no banco de dados, e que o nome da tabela é 'guest_check'
export class GuestCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({name: 'created_at'}) // aqui estamos dizendo que a coluna 'created_at' é uma coluna da tabela 'guest_check', e que o valor dela será gerado automaticamente como a data e hora atual, e o nome da coluna será 'created_at'
  createdAt: Date;

  @Column({ // aqui estamos dizendo que a coluna 'status' é uma coluna da tabela 'guest_check', e que o tipo dela é um enum, e que o valor padrão é 'OPENED'
    type: 'enum',
    enum: GuestCheckStatus,
    default: GuestCheckStatus.OPENED
  })
  status: GuestCheckStatus; 

  @ManyToOne(() => Spot, { nullable: false }) // aqui estamos dizendo que a coluna 'spot' é uma coluna da tabela 'guest_check', e que o tipo dela é uma entidade, e que a entidade é a classe Spot, e que a coluna 'spot_id' é a coluna da tabela 'spot' que está vinculada a 'guest_check'
  @JoinColumn({ name: 'spot_id' })
  spot: Spot;
}

//resumindo: nesse arquivo estamos dizendo que a classe GuestCheck é uma entidade, e que ela é uma tabela no banco de dados, e que o nome da tabela é 'guest_check', e que a coluna 'created_at' é uma coluna da tabela 'guest_check', e que o valor dela será gerado automaticamente como a data e hora atual, e o nome da coluna será 'created_at', e que a coluna 'status' é uma coluna da tabela 'guest_check', e que o tipo dela é um enum, e que o valor padrão é 'OPENED', e que a coluna 'spot' é uma coluna da tabela 'guest_check', e que o tipo dela é uma entidade, e que a entidade é a classe Spot, e que a coluna 'spot_id' é a coluna da tabela 'spot' que está vinculada a 'guest_check'