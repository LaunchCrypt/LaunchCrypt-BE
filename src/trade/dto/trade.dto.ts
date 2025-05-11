import { LiquidityPair } from '@/liquidity-pairs/schemas/liquidityPairs.schema';
import { IsNotEmpty, IsOptional } from "class-validator";
import { Token } from '@/token/schemas/token.schema';

export class CreateTradeDto {
    @IsNotEmpty()
    liquidityPairId: string

    @IsNotEmpty()
    tokenId: string

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