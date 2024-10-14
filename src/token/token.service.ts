import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { dateFormatter } from 'src/utils/utils';

@Injectable()
export class TokenService {
    private readonly binanceKlinesApiUrl = 'https://api.binance.com/api/v3/klines'

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
