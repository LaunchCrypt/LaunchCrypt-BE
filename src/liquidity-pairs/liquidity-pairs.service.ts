import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LiquidityPair } from './schemas/liquidityPairs.schema';
import { Model } from 'mongoose';
import { QueryAllDto } from 'src/common/dto/queryAll.dto';
import { CreateLiquidityPairDto } from './dto/createLiquidityPair.dto';

@Injectable()
export class LiquidityPairsService {
    constructor(@InjectModel(LiquidityPair.name) private liquidityPairModel: Model<LiquidityPair>) {}

    async getAllLiquidityPairs(queryAllDto: QueryAllDto):Promise<LiquidityPair[]>{
        const { page = 1, limit = 20, sortField, sortOrder = 'asc' } = queryAllDto;
        const skip = (page - 1) * limit;
        const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};

        return await this.liquidityPairModel.find().skip(skip).limit(limit).sort(sort).exec();
    }

    async getLiquidityPairByContractAddress(contractAddress: string): Promise<LiquidityPair> {
        const liquidityPair = await this.liquidityPairModel.findOne({ contractAddress: contractAddress }).exec();
        if(!liquidityPair){
            throw new NotFoundException('Liquidity Pair not found');
        }
        return liquidityPair;
    }

    async createLiquidityPair(CreateLiquidityPairDto: CreateLiquidityPairDto): Promise<LiquidityPair> {
        const newLiquidityPair = new this.liquidityPairModel(CreateLiquidityPairDto);
        return await newLiquidityPair.save();
    }
}
