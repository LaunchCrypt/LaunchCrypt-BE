import { Module } from '@nestjs/common';
import { ExTokenController } from './ex-token.controller';
import { ExTokenService } from './ex-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExToken, ExTokenSchema } from './schemas/ex-token.schema';

@Module({
  controllers: [ExTokenController],
  providers: [ExTokenService],
  imports: [
    MongooseModule.forFeature([
      { name: ExToken.name, schema: ExTokenSchema },
    ]),
  ],
  exports: [ExTokenService]
})
export class ExTokenModule {}
