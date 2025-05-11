import { Module } from '@nestjs/common';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './schemas/trade.schema';
import { TradeGateway } from './gateway/trade.gateway';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MongooseModule.forFeature(
    [
      {
        name: Trade.name,
        schema: TradeSchema
      }
    ]
  ), UserModule],
  providers: [TradeService, TradeGateway],
  controllers: [TradeController],
  exports: [TradeService],
})
export class TradeModule { }
