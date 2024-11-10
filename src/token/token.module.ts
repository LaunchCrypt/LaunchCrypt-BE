import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenGateway } from './gateway/token-gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';

@Module({
  controllers: [TokenController],
  providers: [TokenService, TokenGateway],
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
    ])
  ]
})
export class TokenModule { }
