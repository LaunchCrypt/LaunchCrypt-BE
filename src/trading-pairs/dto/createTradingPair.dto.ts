import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateTokenDto } from "../../token/dto/createToken.dto";
import { Token } from "src/token/schemas/token.schema";

export class CreateTradingPairDto {
    @IsNotEmpty()
    creator: string;

    @IsNotEmpty()
    tokenA: string;

    @IsNotEmpty()
    tokenB: string;

    @IsNotEmpty()
    tokenAReserve: string;

    @IsNotEmpty()
    tokenBReserve: string;

    @IsNotEmpty()
    chainId:number;

    @IsNotEmpty()
    poolAddress: string;

    @IsNotEmpty()
    totalLP: string;
}


export class UpdateTradingPairDto {
    @IsOptional()
    comments: number 

    @IsOptional()
    tokenAReserve: string;

    @IsOptional()
    tokenBReserve: string;
}