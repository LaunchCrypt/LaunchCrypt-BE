import { Module } from '@nestjs/common';
import { TradingPairsController } from './trading-pairs.controller';
import { TradingPairsService } from './trading-pairs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TradingPair, TradingPairSchema } from "./schemas/tradingPairs.schema"
import { Token } from '@uniswap/sdk-core';
import { TokenSchema } from 'src/token/schemas/token.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: TradingPair.name, schema: TradingPairSchema },
  { name: Token.name, schema: TokenSchema }
  ])],
  controllers: [TradingPairsController],
  providers: [TradingPairsService],
  exports: [TradingPairsService]
})
export class TradingPairsModule { }
