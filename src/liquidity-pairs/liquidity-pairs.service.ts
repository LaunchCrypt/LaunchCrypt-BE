import axios from 'axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LiquidityPair } from './schemas/liquidityPairs.schema';
import { Model } from 'mongoose';
import { QueryAllDto } from 'src/common/dto/queryAll.dto';
import { CreateLiquidityPairDto, UpdateLiquidityPairDto } from './dto/createLiquidityPair.dto';

@Injectable()   
export class LiquidityPairsService {
    constructor(
    @InjectModel(LiquidityPair.name) private liquidityPairModel: Model<LiquidityPair>,
) {}


    async getAllLiquidityPairs(queryAllDto: QueryAllDto): Promise<any[]> {
    const { page = 1, limit = 20, sortField, sortOrder = 'asc', keyword } = queryAllDto;
    console.log(queryAllDto);
    const skip = (page - 1) * limit;
    const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};
    const filter = keyword ? { 'tokenA.symbol': { $regex: keyword, $options: 'i' } } : {};

    // Fetch AVAX price (latest close price)
    const avaxPrice = await this.getNativeTokenPrice('AVAXUSDT');
    const pairs = await this.liquidityPairModel.find(filter).skip(skip).limit(limit).sort(sort).exec();
    return pairs.map(pair => ({
      ...pair.toObject(),
      marketcap: Number(pair.tokenBReserve) * Number(avaxPrice)
    }));
  }

    async getLiquidityPairByContractAddress(contractAddress: string): Promise<LiquidityPair> {
        const liquidityPair = await this.liquidityPairModel.findOne({ poolAddress: contractAddress }).exec();
        if (!liquidityPair) {
            throw new NotFoundException('Liquidity Pair not found');
        }
        return liquidityPair;
    }

    async createLiquidityPair(CreateLiquidityPairDto: CreateLiquidityPairDto): Promise<LiquidityPair> {
        const newLiquidityPair = new this.liquidityPairModel(CreateLiquidityPairDto);
        return await newLiquidityPair.save();
    }

    async getLiquidityPairByToken(tokenA: string): Promise<LiquidityPair> {
        const liquidityPair = await this.liquidityPairModel.findOne({ 'tokenA.contractAddress': tokenA }).exec();
        if (!liquidityPair) {
            throw new NotFoundException('Liquidity Pair not found');
        }
        return liquidityPair;
    }

    async updateLiquidityPair(contractAddress: string, updateLiquidityPairDto: UpdateLiquidityPairDto): Promise<LiquidityPair> {
        const updatedLiquidityPair = await this.liquidityPairModel.findOneAndUpdate(
            { poolAddress: contractAddress },
            updateLiquidityPairDto,
            { new: true })
            .exec();
        if (!updatedLiquidityPair) {
            throw new NotFoundException('Liquidity Pair not found');
        }
        return updatedLiquidityPair;
    }
    async getNativeTokenPrice(symbol: string) {
        // call API to binance
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        return response.data.price;
    }
}
