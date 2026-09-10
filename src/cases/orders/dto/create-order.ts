import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsPositive, IsUUID, Validate, ValidateNested } from "class-validator";

export class CreateOrderItemDto{
    @IsUUID()
    productId: string;

    @IsInt()
    @IsPositive() // aqui estamos dizendo que o campo quantity deve ser um número inteiro positivo, ou seja, maior que zero
    quantity: number;


}
export class CreateOrderDto {
    @IsUUID()
    spotId: string; //nesse caso, o spotId é o id do guest check, que é a mesa que está sendo atendida, e que está vinculada ao pedido, e que é um campo obrigatório, pois não podemos criar um pedido sem vincular a uma mesa.

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[]; // aqui estamos dizendo que o campo item é um array de CreateOrderItemDto, e que cada elemento do array deve ser validado como um CreateOrderItemDto
}