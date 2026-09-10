import { Repository } from "typeorm";
import { GuestCheck, GuestCheckStatus } from "./guest-check.entity";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateGuestCheckDto } from "./dto/create-guest-check";
import { Spot } from "../spots/spot.entity";

@Injectable()
export class GuestCheckService {
  
  constructor(
    @InjectRepository(GuestCheck)
    private readonly guestCheckRepository: Repository<GuestCheck>,

    @InjectRepository(Spot)
    private readonly spotRepository: Repository<Spot>,
  ) {}


  async create(dto: CreateGuestCheckDto): Promise<GuestCheck> {

    //Regra #1: Não se abre comanda para mesa inexistente ou inativa
    const spot = await this.spotRepository.findOneBy({ id: dto.spotId, active: true });

    if (!spot) {
      throw new NotFoundException('Não foi encontrada uma mesa ativa com este ID');
   
    }

    // Regra #2: Não se abre comanda em mesa que EXISTA uma mesa aberta
    const opened  = await this.guestCheckRepository.exists({
      where: { spot: { id: dto.spotId }, status: GuestCheckStatus.OPENED }
    });

    if (opened) {
      throw new ConflictException('A mesa já possui uma comanda aberta');
    }

    // Se chegou até aqui, então podemos abrir a comanda
    const guestCheck = this.guestCheckRepository.create({
      spot,
      status: GuestCheckStatus.OPENED
    });

    return this.guestCheckRepository.save(guestCheck);
  }

   async findOne(id: string): Promise<GuestCheck> {
      const guestCheck = await this.guestCheckRepository.findOneBy({ id });
      
      if (!guestCheck) {
        throw new NotFoundException('Comanda não encontrada');
      }
      return guestCheck;
    }
  
  async close(id: string): Promise<GuestCheck> {
    const guestCheck = await this.findOne(id);

    // Regra #1: Só posso fechar uma comanda que esteja aberta
    if (guestCheck.status === GuestCheckStatus.CLOSED) {
      throw new ConflictException('A comanda já está fechada');
    }

    //Regra #2: Não posso fechar uma comanda com pedidos que não foram entregues.
    //TO_DO: Implementar isto depois (dívida técnica)


    //Se chegou até aqui, deu certo.
    guestCheck.status = GuestCheckStatus.CLOSED; 

    return this.guestCheckRepository.save(guestCheck);

  }

  findOpenedBySpotId(spotId: string): Promise<GuestCheck | null>{
    return this.guestCheckRepository.findOne({
      where: {
        spot: { id: spotId},
        status: GuestCheckStatus.OPENED
      },
      relations: { spot: true}
    })
  }

  async findOrcCreateOpened(spotId: string): Promise<GuestCheck> {
    const opened = await this.findOpenedBySpotId(spotId);

    if (opened) {
      return opened;
    }

    return this.create({ spotId})
  }
}