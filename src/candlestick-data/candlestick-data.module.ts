import { Module } from '@nestjs/common';
import { CandlestickDataController } from './candlestick-data.controller';
import { CandlestickDataService } from './candlestick-data.service';
import { CandlestickWorkerService } from './worker/candlestick-data.worker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CandlestickData, CandlestickDataSchema } from './schemas/candlestickData.schema';
import { LiquidityPair, LiquidityPairSchema } from 'src/liquidity-pairs/schemas/liquidityPairs.schema';
import { Trade, TradeSchema } from 'src/trade/schemas/trade.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CandlestickData.name, schema: CandlestickDataSchema },
      { name: LiquidityPair.name, schema: LiquidityPairSchema },
      { name: Trade.name, schema: TradeSchema },
    ]),
  ],
  controllers: [CandlestickDataController],
  providers: [CandlestickDataService, CandlestickWorkerService]
})
export class CandlestickDataModule {}
