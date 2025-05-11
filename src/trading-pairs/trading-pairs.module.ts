import { Module } from '@nestjs/common';
import { TradingPairsController } from './trading-pairs.controller';
import { TradingPairsService } from './trading-pairs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TradingPair, TradingPairSchema } from "./schemas/tradingPairs.schema"
import { Token } from '@uniswap/sdk-core';
import { TokenSchema } from '@/token/schemas/token.schema';
import { ExTokenModule } from '@/ex-token/ex-token.module';

@Module({
  imports: [MongooseModule.forFeature(
  [
    { name: TradingPair.name, schema: TradingPairSchema },
    { name: Token.name, schema: TokenSchema }
  ]),
  ExTokenModule
],
  controllers: [TradingPairsController],
  providers: [TradingPairsService],
  exports: [TradingPairsService]
})
export class TradingPairsModule { }
