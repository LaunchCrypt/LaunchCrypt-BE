import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './schemas/trade.schema';

@Module({
  imports: [MongooseModule.forFeature(
    [
      {
        name: Trade.name,
        schema: TradeSchema
      }
    ]
  )],
  providers: [TradeService],
  controllers: [TradeController]
})
export class TradeModule { }
