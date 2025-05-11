import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { UserModule } from '../user/user.module';
import { TradeModule } from '../trade/trade.module';
import { StakeModule } from '../stake/stake.module';

@Module({
  imports: [
    UserModule,
    TradeModule,
    StakeModule
  ],
  controllers: [StatsController],
  providers: [StatsService]
})
export class StatsModule {}
