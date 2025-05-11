import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Token } from '../../token/schemas/token.schema';

export class CreateLiquidityPairDto {
    @IsNotEmpty()
    creator: string;

    @IsOptional()
    comments: number = 0 //the number of total comments

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => Token)
    tokenA: Token;

    @IsNotEmpty()
    tokenAReserve: string;

    @IsNotEmpty()
    tokenBReserve: string;

    @IsNotEmpty()
    chainId:number;

    @IsNotEmpty()
    poolAddress: string;

    @IsNotEmpty()
    poolFee: number;
}


export class UpdateLiquidityPairDto {
    @IsOptional()
    comments: number 

    @IsOptional()
    tokenAReserve: string;

    @IsOptional()
    tokenBReserve: string;
}