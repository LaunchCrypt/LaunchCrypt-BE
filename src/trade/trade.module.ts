import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './schemas/trade.schema';
import { TradeGateway } from './gateway/trade.gateway';

@Module({
  imports: [MongooseModule.forFeature(
    [
      {
        name: Trade.name,
        schema: TradeSchema
      }
    ]
  )],
  providers: [TradeService, TradeGateway],
  controllers: [TradeController]
})
export class TradeModule { }
