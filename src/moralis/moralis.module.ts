import { Global, Module } from '@nestjs/common';
import { MoralisController } from './moralis.controller';
import { MoralisService } from './moralis.service';

@Global()
@Module({
  providers: [MoralisService],
  controllers: [MoralisController],
  exports: [MoralisService],
})
export class MoralisModule {}
