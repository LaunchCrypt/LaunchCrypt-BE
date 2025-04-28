import { Module } from '@nestjs/common';
import { StakeController } from './stake.controller';
import { StakeService } from './stake.service';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Stake, StakeSchema } from './schemas/stake.schema';

@Module({
  controllers: [StakeController],
  providers: [StakeService],
  imports: [
    MongooseModule.forFeature([
      { name: Stake.name, schema: StakeSchema },
    ])
  ],
  exports: [StakeService],
})
export class StakeModule {}
