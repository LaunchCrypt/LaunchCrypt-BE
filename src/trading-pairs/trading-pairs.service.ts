import { QueryAllDto } from '@/common/dto/queryAll.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TradingPair } from './schemas/tradingPairs.schema';
import { Model } from 'mongoose';
import { CreateTradingPairDto, UpdateTradingPairDto } from './dto/createTradingPair.dto';
import { ethers } from 'ethers';
import { erc20Abi } from '@/abi/ethereum/erc20ABI';
import { FUJI_PROVIDER } from '../../constants';
import { ExTokenService } from '@/ex-token/ex-token.service';

@Injectable()
export class TradingPairsService {
    constructor(
        @InjectModel(TradingPair.name) private tradingPairModel: Model<TradingPair>,
        private exTokenService: ExTokenService
    ) { }

    async getAllTradingPairs(queryAllDto: QueryAllDto): Promise<TradingPair[]> {
        const { page = 1, limit = 20, sortField, sortOrder = 'asc', keyword } = queryAllDto;
        const skip = (page - 1) * limit;
        const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};
        // filter both tokenA and tokenB
        const filter = keyword ? { $or: [{ 'tokenA.symbol': { $regex: keyword, $options: 'i' } }, { 'tokenB.symbol': { $regex: keyword, $options: 'i' } }] } : {};


        return await this.tradingPairModel.find(filter).skip(skip).limit(limit).sort(sort).exec();
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
            throw new NotFoundException('Trading Pair not found');
        }
        return tradingPair;
    }

    async getTradingPairsByContract(contractAddress: string): Promise<TradingPair> {
        console.log(contractAddress)
        const tradingPair = await this.tradingPairModel.findOne({ poolAddress: contractAddress }).exec();
        if (!tradingPair) {
            throw new NotFoundException('Trading Pair not found');
        }
        return tradingPair;
    }

    async createTradingPair(createTradingPairDto: CreateTradingPairDto): Promise<TradingPair> {
        console.log(createTradingPairDto)
        let { tokenA, tokenB } = createTradingPairDto;
        const {baseToken, quoteToken} = await this.sortTokenAddresses(tokenA, tokenB);
        const {name: tokenAName, symbol: tokenASymbol} = await this.getOnchainTokenData(baseToken);
        const {name: tokenBName, symbol: tokenBSymbol} = await this.getOnchainTokenData(quoteToken);
        const tokenAExToken = await this.exTokenService.createExToken({
            name: tokenAName,
            symbol: tokenASymbol,
            contractAddress: tokenA
        });
        const tokenBExToken = await this.exTokenService.createExToken({
            name: tokenBName,
            symbol: tokenBSymbol,
            contractAddress: tokenB
        });

        const createdTradingPair = new this.tradingPairModel(
            {
                creator: createTradingPairDto.creator,
                tokenA: tokenAExToken,
                tokenB: tokenBExToken,
                tokenAReserve: createTradingPairDto.tokenAReserve,
                tokenBReserve: createTradingPairDto.tokenBReserve,
                chainId: createTradingPairDto.chainId,
                poolAddress: createTradingPairDto.poolAddress,
                totalLP: createTradingPairDto.totalLP
            }
        );
        return createdTradingPair.save();
    }

    async updateTradingPairReserve(contractAddress: string, UpdateTradingPairDto: UpdateTradingPairDto): Promise<TradingPair> {
        // get total supply from contract address
        const newTotalLP = await this.getTotalSupply(contractAddress);
        const reserveA = await this.getReserve(contractAddress, UpdateTradingPairDto.tokenAAddress);
        const reserveB = await this.getReserve(contractAddress, UpdateTradingPairDto.tokenBAddress);
        const updatedTradingPair = await this.tradingPairModel.findOneAndUpdate(
            { poolAddress: contractAddress },
            {
                tokenAReserve: reserveA,
                tokenBReserve: reserveB,
                totalLP: newTotalLP
            },
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

    async sortTokenAddresses(tokenA: string, tokenB: string) {
        // Convert addresses to BigInt for proper comparison of large hexadecimal values
        const addressA = BigInt(tokenA);
        const addressB = BigInt(tokenB);
        
        // Compare and return in sorted order
        if (addressA < addressB) {
          return { baseToken: tokenA, quoteToken: tokenB };
        } else {
          return { baseToken: tokenB, quoteToken: tokenA };
        }
      }

    async getTotalSupply(contractAddress: string) {
        const tokenContract = new ethers.Contract(contractAddress, erc20Abi, FUJI_PROVIDER);
        const totalSupply = await tokenContract.totalSupply();
        return totalSupply;
    }

    async getReserve(contractAddress: string, tokenAddress: string) {
        const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, FUJI_PROVIDER);
        const reserve = await tokenContract.balanceOf(contractAddress);
        return reserve;
    }
}
