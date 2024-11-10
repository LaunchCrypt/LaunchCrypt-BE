import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TOKEN_FACTORY_ADDRESS } from '../../constants';
import { dateFormatter, getContract } from 'src/utils/utils';
import { TOKEN_FACTORY_ABI } from 'src/abi/ethereum/token_factory_abi';
import { CreateTokenDto } from './dto/createToken.dto';
import { BigNumber } from 'ethers';
import { InjectModel } from '@nestjs/mongoose';
import { Token } from './schemas/token.schema';
import { Model } from 'mongoose';

@Injectable()
export class TokenService {
    constructor(@InjectModel(Token.name) private tokenModel: Model<Token>) {
    }
    private readonly binanceKlinesApiUrl = 'https://api.binance.com/api/v3/klines'
    private tokenFactoryContract = getContract(
        TOKEN_FACTORY_ADDRESS,
        TOKEN_FACTORY_ABI,
        'fuji'
    )

    async createToken(createTokenDto: CreateTokenDto) {
        const totalSupplyBigNumber = BigNumber.from(createTokenDto.totalSupply);
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

        // Handle the case where the event is not found
        if (!tokenCreatedEvent) {
            throw new Error('TokenCreated event not found in transaction receipt');
        }

        // Extract the token address from event emit
        const tokenAddress = tokenCreatedEvent.args[0];

        // Create a new token document
        const token = new this.tokenModel({
            ...createTokenDto,
            contractAddress: tokenAddress,
        });
        token.save();

        return tokenAddress;
    }


    async getNativeTokenPriceHistory(symbol: string, interval: string, limit: number, type: "dayMonth" | "time") {
        // get klines data from binance
        const klines = await this.getKlines(symbol, interval, limit);
        return this.processKlinesData(klines, type);

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
