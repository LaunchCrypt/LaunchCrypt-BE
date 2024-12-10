import { Price } from "@uniswap/sdk-core";
import { isNotEmpty, IsNotEmpty, IsOptional } from "class-validator";
import { Token } from "src/token/schemas/token.schema";

export class CreateTradeDto {
    @IsNotEmpty()
    liquidityPairId: string

    @IsNotEmpty()
    token: Token

    @IsOptional()
    price: number

    @IsNotEmpty()
    amount: number

    @IsOptional()
    timeStamp: number //Unix timestamp in miliseconds

    @IsNotEmpty()
    side: 'buy' | 'sell'

    @IsNotEmpty()
    creator: string

    @IsNotEmpty()
    transactionHash: string
}