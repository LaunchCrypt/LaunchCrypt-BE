import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenGateway } from './gateway/token-gateway';

@Module({
  controllers: [TokenController],
  providers: [TokenService, TokenGateway]
})
export class TokenModule { }
