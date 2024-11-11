import { Module } from '@nestjs/common';
import { LiquidityPairsService } from './liquidity-pairs.service';
import { LiquidityPairsController } from './liquidity-pairs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LiquidityPair, LiquidityPairSchema } from './schemas/liquidityPairs.schema';
import { Token, TokenSchema } from 'src/token/schemas/token.schema';

/**
 * This is module for trading pairs (new token) & native token (support virtual liquidity)
 * We will have another module for imported token
 */
@Module({
  imports: [MongooseModule.forFeature([{ name: LiquidityPair.name, schema: LiquidityPairSchema },
          { name: Token.name, schema: TokenSchema },]),
],  
  providers: [LiquidityPairsService],
  controllers: [LiquidityPairsController],
  exports: [LiquidityPairsService]
})
export class LiquidityPairsModule {}
