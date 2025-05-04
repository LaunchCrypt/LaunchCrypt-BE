import { QueryAllDto } from 'src/common/dto/queryAll.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TradingPair } from './schemas/tradingPairs.schema';
import { Model } from 'mongoose';
import { CreateTradingPairDto, UpdateTradingPairDto } from './dto/createTradingPair.dto';
import { ethers } from 'ethers';
import { erc20Abi } from 'src/abi/ethereum/erc20ABI';
import { FUJI_PROVIDER } from '../../constants';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class TradingPairsService {
    constructor(
        @InjectModel(TradingPair.name) private tradingPairModel: Model<TradingPair>,
        private tokenService: TokenService
    ) { }

    async getAllTradingPairs(queryAllDto: QueryAllDto): Promise<TradingPair[]> {
        const { page = 1, limit = 20, sortField, sortOrder = 'asc' } = queryAllDto;
        const skip = (page - 1) * limit;
        const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};

        return await this.tradingPairModel.find().skip(skip).limit(limit).sort(sort).exec();
    }

    async getTradingPairsByToken(tokenA: string): Promise<TradingPair[]> {
        const tradingPair = await this.tradingPairModel.find({
            $or: [
                { 'tokenA.contractAddress': tokenA },
                { 'tokenB.contractAddress': tokenA }
            ]
        }).exec();
        if (!tradingPair) {
            throw new NotFoundException('Liquidity Pair not found');
        }
        return tradingPair;
    }

    async getTradingPairsByTokenPair(tokenA: string, tokenB: string): Promise<TradingPair> {
        const tradingPair = await this.tradingPairModel.findOne({
            $or: [
                { 'tokenA.contractAddress': tokenA, 'tokenB.contractAddress': tokenB },
                { 'tokenA.contractAddress': tokenB, 'tokenB.contractAddress': tokenA }
            ]
        }).exec();
        if (!tradingPair) {
            throw new NotFoundException('Liquidity Pair not found');
        }
        return tradingPair;
    }

    async getTradingPairsByContract(contractAddress: string): Promise<TradingPair> {
        const tradingPair = await this.tradingPairModel.findOne({ poolAddress: contractAddress }).exec();
        if (!tradingPair) {
            throw new NotFoundException('Liquidity Pair not found');
        }
        return tradingPair;
    }

    async createTradingPair(createTradingPairDto: CreateTradingPairDto): Promise<TradingPair> {
        const { tokenA, tokenB } = createTradingPairDto;
        const {name: tokenAName, symbol: tokenASymbol} = await this.getOnchainTokenData(tokenA);
        const {name: tokenBName, symbol: tokenBSymbol} = await this.getOnchainTokenData(tokenB);

        // await this.tokenService.createToken({
        //     name: tokenAName,
        //     symbol: tokenASymbol,
        //     contractAddress: tokenA,
        //     chainId: createTradingPairDto.chainId
        // });

        const createdTradingPair = new this.tradingPairModel(createTradingPairDto);
        return createdTradingPair.save();
    }

    async updateTradingPair(contractAddress: string, UpdateTradingPairDto: UpdateTradingPairDto): Promise<TradingPair> {
        const updatedTradingPair = await this.tradingPairModel.findOneAndUpdate(
            { poolAddress: contractAddress },
            UpdateTradingPairDto,
            { new: true })
            .exec();
        if (!updatedTradingPair) {
            throw new NotFoundException('Liquidity Pair not found');
        }
        return updatedTradingPair;
    }

    async getOnchainTokenData(contractAddress: string) {
        const tokenContract = new ethers.Contract(contractAddress, erc20Abi, FUJI_PROVIDER);
        const name = await tokenContract.name();
        const symbol = await tokenContract.symbol();
        return { name, symbol };
    }
}
