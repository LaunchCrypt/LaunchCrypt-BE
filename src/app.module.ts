import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniswapModule } from './uniswap/uniswap.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import databaseConfig from './config/database.config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { LiquidityPairsModule } from './liquidity-pairs/liquidity-pairs.module';
import { TradingPairsModule } from './trading-pairs/trading-pairs.module';
import { CandlestickDataModule } from './candlestick-data/candlestick-data.module';
import { TradeModule } from './trade/trade.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
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
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
