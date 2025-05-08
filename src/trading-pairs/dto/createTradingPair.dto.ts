import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateTokenDto } from "../../token/dto/createToken.dto";
import { Token } from "src/token/schemas/token.schema";

export class CreateTradingPairDto {
    @IsNotEmpty()
    creator: string;

    @IsNotEmpty()
    tokenA: string; // address of the token contract

    @IsNotEmpty()
    tokenB: string; // address of the token contract    

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
    tokenAAddress: string;

    @IsOptional()
    tokenBAddress: string;
}