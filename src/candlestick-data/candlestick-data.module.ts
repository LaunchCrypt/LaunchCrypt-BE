import { Module } from '@nestjs/common';
import { CandlestickDataController } from './candlestick-data.controller';
import { CandlestickDataService } from './candlestick-data.service';

@Module({
  controllers: [CandlestickDataController],
  providers: [CandlestickDataService]
})
export class CandlestickDataModule {}
