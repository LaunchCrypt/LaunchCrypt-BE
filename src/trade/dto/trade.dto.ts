import { Price } from "@uniswap/sdk-core";
import { isNotEmpty, IsNotEmpty, IsOptional } from "class-validator";

export class CreateTradeDto {
    @IsNotEmpty()
    liquidityPairId: string

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