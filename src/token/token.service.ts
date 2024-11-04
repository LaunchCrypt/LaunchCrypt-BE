import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { TOKEN_FACTORY_ADDRESS } from '../../constants';
import { dateFormatter, getContract } from 'src/utils/utils';
import { TOKEN_FACTORY_ABI } from 'src/abi/ethereum/token_factory_abi';
import { CreateTokenDto } from './dto/createToken.dto';

@Injectable()
export class TokenService {
    private readonly binanceKlinesApiUrl = 'https://api.binance.com/api/v3/klines'
    private tokenFactoryContract = getContract(
        TOKEN_FACTORY_ADDRESS,
        TOKEN_FACTORY_ABI,
    )       

    async createToken(createTokenDto: CreateTokenDto) {
        const tokenAddress = await this.tokenFactoryContract.createToken(createTokenDto.name, createTokenDto.symbol);
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
