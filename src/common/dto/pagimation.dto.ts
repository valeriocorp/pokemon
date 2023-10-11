import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";
import { off } from "process";

export class PaginationDto{

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    offset?: number;
}