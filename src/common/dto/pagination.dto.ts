import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class paginationDto {

    @IsOptional()
    @IsNumber()
    @Min(1)
    @IsPositive()
    size?: number;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @IsPositive()
    page?: number

}