import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniswapModule } from './uniswap/uniswap.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import databaseConfig from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { LiquidityPairsModule } from './liquidity-pairs/liquidity-pairs.module';
import { TradingPairsModule } from './trading-pairs/trading-pairs.module';
import { CandlestickDataModule } from './candlestick-data/candlestick-data.module';
import { TradeModule } from './trade/trade.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { MoralisModule } from './moralis/moralis.module';
import { ScheduleModule } from '@nestjs/schedule';
import { StakeModule } from './stake/stake.module';
import { StatsModule } from './stats/stats.module';


@Module({
  imports: [
    ScheduleModule.forRoot(), // This enables cron jobs
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig]
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
        retryAttempts: 3,
        retryDelay: 1000,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
      }),
      inject: [ConfigService],
    }),
    UniswapModule,
    TokenModule,
    LiquidityPairsModule,
    TradingPairsModule,
    CandlestickDataModule,
    TradeModule,
    ChatModule,
    UserModule,
    MoralisModule,
    StakeModule,
    StatsModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
