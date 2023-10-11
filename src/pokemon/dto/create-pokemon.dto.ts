import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

//DATA TRANSFER OBJECT (los datos que se van a resibir en el body y las reglas de validacion)
export class CreatePokemonDto {
    
    @IsString()
    @MinLength(1)
    name: string;

    @IsInt()
    @IsPositive()
    @Min(1)
    no: number;
}
