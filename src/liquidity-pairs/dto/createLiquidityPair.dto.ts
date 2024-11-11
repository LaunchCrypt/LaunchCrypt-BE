import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateTokenDto } from "../../token/dto/createToken.dto";

export class CreateLiquidityPairDto {
    @IsNotEmpty()
    creator: string;

    @IsOptional()
    comments: number = 0 //the number of total comments

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateTokenDto)
    tokenA: CreateTokenDto;

    @IsNotEmpty()
    tokenAReserve: string;

    @IsNotEmpty()
    tokenBReserve: string;

    @IsNotEmpty()
    chainId:number;

    @IsNotEmpty()
    poolAddress: string;
}
