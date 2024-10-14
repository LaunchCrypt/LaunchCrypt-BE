import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniswapModule } from './uniswap/uniswap.module';
import { TokenModule } from './token/token.module';

@Module({
  imports: [UniswapModule, TokenModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
