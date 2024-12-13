import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { FUJI_CHAIN_ID, TOKEN_FACTORY_ADDRESS } from '../../constants';
import { dateFormatter, getContract } from 'src/utils/utils';
import { TOKEN_FACTORY_ABI } from 'src/abi/ethereum/token_factory_abi';
import { CreateTokenDto } from './dto/createToken.dto';
import { ethers } from 'ethers';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import { Model } from 'mongoose';
import { LiquidityPairsService } from 'src/liquidity-pairs/liquidity-pairs.service';
import { QueryAllDto } from 'src/common/dto/queryAll.dto';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: Model<Token>,
        private liquidityPairsService: LiquidityPairsService) { }
    private readonly binanceKlinesApiUrl = 'https://api.binance.com/api/v3/klines'
    private tokenFactoryContract = getContract(
        TOKEN_FACTORY_ADDRESS,
        TOKEN_FACTORY_ABI,
        'fuji'
    )

    async getAllTokens(queryAllDto: QueryAllDto) {
        const { page = 1, limit = 20, sortField, sortOrder = 'asc' } = queryAllDto;
        const skip = (page - 1) * limit;
        const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};

        return await this.tokenModel.find().skip(skip).limit(limit).sort(sort).exec();
    }

    async getTokenByContractAddress(contractAddress: string) {
        const token = await this.tokenModel.findOne({
            contractAddress: { 
                $regex: new RegExp(`^${contractAddress}$`, 'i') 
            }
        })
        if (!token) {
            throw new NotFoundException('Token not found');
        }
        return token;
    }

    async getNativeTokenPriceHistory(symbol: string, interval: string, limit: number, type: "dayMonth" | "time") {
        // get klines data from binance
        const klines = await this.getKlines(symbol, interval, limit);
        return this.processKlinesData(klines, type);
    }

    async createToken(createTokenDto: CreateTokenDto) {
        console.log('createTokenDto', createTokenDto.totalSupply);
        const totalSupplyBigNumber = ethers.utils.parseEther(createTokenDto.totalSupply);
        const txResponse = await this.tokenFactoryContract.createToken(
            createTokenDto.name,
            createTokenDto.symbol,
            totalSupplyBigNumber
        );

        // Wait for the transaction to be mined
        const txReceipt = await txResponse.wait();

        // Find the TokenCreated event
        const tokenCreatedEvent = txReceipt.events.find(
            (event) => event.event === 'TokenCreated'
        );

        const liquidityPairsCreatedEvent = txReceipt.events.find(
            (event) => event.event === 'LiquidityPairsCreated'
        )

        // Handle the case where the event is not found
        if (!tokenCreatedEvent) {
            throw new NotFoundException('TokenCreated event not found in transaction receipt');
        }
        if (!liquidityPairsCreatedEvent) {
            throw new NotFoundException('LiquidityPairsCreated event not found in transaction receipt');
        }

        // Extract the token address from event emit
        const tokenAddress = tokenCreatedEvent.args[0];
        const liquidityPairAddress = liquidityPairsCreatedEvent.args[0];

        // Create a new token document
        const token = new this.tokenModel({
            ...createTokenDto,
            contractAddress: tokenAddress,
        });
        const newToken = await token.save();
        // Create a liquidity pair for the new token
        await this.liquidityPairsService.createLiquidityPair({
            creator: createTokenDto.creator,
            comments: 0,
            tokenA: newToken,
            tokenAReserve: createTokenDto.totalSupply,
            tokenBReserve: "100",
            chainId: FUJI_CHAIN_ID,
            poolAddress: liquidityPairAddress
        });

        return tokenAddress;
    }

    async getKlines(symbol: string, interval: string, limit: number) {
        const url = `${this.binanceKlinesApiUrl}?symbol=${symbol}&interval=${interval}&limit=${limit}`;
        const response = await axios.get(url);
        return response.data;
    }

    processKlinesData(klines: any[], type: "dayMonth" | "time") {
        let minPrice = 999999999;
        let maxPrice = 0
        const data = klines.map(kline => {
            const [
                startTime,
                open,
                high,
                low,
                close,
                volume,
                endTime,
                quoteAssetVolume,
                numberOfTrades,
                takerBuyBaseAssetVolume,
                takerBuyQuoteAssetVolume,
                ignore
            ] = kline;

            const price = parseFloat(quoteAssetVolume) / parseFloat(volume);
            const time = dateFormatter(startTime, endTime, type);
            if (price < minPrice) {
                minPrice = price;
            }
            if (price > maxPrice) {
                maxPrice = price;
            }
            return {
                price,
                time,
            };
        });

        return { minPrice, maxPrice, price: data }
    }
}
