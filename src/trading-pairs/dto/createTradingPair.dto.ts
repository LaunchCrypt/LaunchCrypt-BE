import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateTokenDto } from "../../token/dto/createToken.dto";
import { Token } from "src/token/schemas/token.schema";

export class CreateTradingPairDto {
    @IsNotEmpty()
    creator: string;

    @IsOptional()
    comments: number = 0 //the number of total comments

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => Token)
    tokenA: Token;

    @IsNotEmpty()
    @ValidateNested({ each: true }) 
    @Type(() => Token)  
    tokenB: Token;

    @IsNotEmpty()
    tokenAReserve: string;

    @IsNotEmpty()
    tokenBReserve: string;

    @IsNotEmpty()
    chainId:number;

    @IsNotEmpty()
    poolAddress: string;

    @IsNotEmpty()
    TVL: string
}


export class UpdateTradingPairDto {
    @IsOptional()
    comments: number 

    @IsOptional()
    tokenAReserve: string;

    @IsOptional()
    tokenBReserve: string;
}