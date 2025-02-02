import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Stake } from './schemas/stake.schema';
import { Model } from 'mongoose';
import { CreateStakeDto, UpdateStakeDto } from './dto/stake.dto';

@Injectable()
export class StakeService {
    constructor(
        @InjectModel(Stake.name) private stakeModel: Model<Stake>,
    ) { }

    async getStakeByStakerAddress(staker: string): Promise<Stake> {
        return await this.stakeModel.findOne({ staker }).exec();
    }

    async createStakeByStakerAddress(createStakeDto: CreateStakeDto): Promise<Stake> {
        const newStake = new this.stakeModel(createStakeDto);
        return await newStake.save();
    }

    async updateStakeByStakerAddress(staker: string, updateStakeDto: UpdateStakeDto): Promise<Stake> {
        return await this.stakeModel.findOneAndUpdate({ staker }, updateStakeDto, { new: true }).exec();
    }

    async deleteStakeByStakerAddress(staker: string): Promise<Stake> {
        return await this.stakeModel.findOneAndDelete({ staker }).exec();
    }
}
