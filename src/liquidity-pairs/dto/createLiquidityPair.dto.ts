import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateTokenDto } from "../../token/dto/createToken.dto";
import { Token } from "src/token/schemas/token.schema";

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
}


export class UpdateLiquidityPairDto {
    @IsOptional()
    comments: number 

    @IsOptional()
    tokenAReserve: string;

    @IsOptional()
    tokenBReserve: string;
}