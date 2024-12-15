import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schemas';
import { LiquidityPair, LiquidityPairSchema } from 'src/liquidity-pairs/schemas/liquidityPairs.schema';
import { ChatGateway } from './gateway/chat.gateway';
import { UserSchema } from 'src/user/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: Chat.name, schema: ChatSchema },
      { name: 'User', schema: UserSchema },
      { name: LiquidityPair.name, schema: LiquidityPairSchema }
    ],
  )],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatGateway]
})
export class ChatModule {}
