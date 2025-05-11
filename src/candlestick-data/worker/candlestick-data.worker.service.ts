import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CandlestickData } from "../schemas/candlestickData.schema";
import { LiquidityPair } from '@/liquidity-pairs/schemas/liquidityPairs.schema';
import { Trade } from '@/trade/schemas/trade.schema';
import { DEFAULT_PRICE } from "../../../constants";

@Injectable()
export class CandlestickWorkerService {
    private readonly logger = new Logger(CandlestickWorkerService.name);

    constructor(
        @InjectModel(CandlestickData.name) private candlestickDataModel: Model<CandlestickData>,
        @InjectModel(LiquidityPair.name) private liquidityPairModel: Model<LiquidityPair>,
        @InjectModel(Trade.name) private tradeModel: Model<Trade>,
    ) {
    }

    private readonly timeframes = {
        "3m": 180,
        "15m": 900,
        "1h": 3600,
        "4h": 14400,
        "1d": 86400,
        "1w": 604800,
    }

    @Cron('0 */3 * * * *')
    async generateThreeMinutesCandlestickData() {
        this.logger.log('Generate 3 minutes candlestick data');
        try {
            const pairs = await this.liquidityPairModel.find().exec();
            for (const pair of pairs) {
                await this.generateCandlestickData((pair as any)._id, '3m');
            }
        } catch (error) {
            this.logger.error('Error generating 3 minutes candlestick data', error);
        }
    }

    // @Cron('45 * * * * *')
    // handleCron() {
    //     this.logger.debug('Called when the current second is 45');
    // }

    private async generateCandlestickData(
        liquidityPairId: Types.ObjectId,
        timeframe: string
    ) {
        const lastCandlestick = await this.candlestickDataModel.findOne({
            liquidityPairId,
            timeframe
        }).sort({ time: -1 }).exec();
        const timeframeSeconds = this.timeframes[timeframe];
        const now = Date.now();
        const currentPeriodStart = Math.floor(now / 1000 / timeframeSeconds) * timeframeSeconds;

        const candlestickData = await this.tradeModel.aggregate([
            {
                $match: {
                    liquidityPairId: liquidityPairId,
                    timestamp: {
                        $gte: currentPeriodStart * 1000,
                        $lt: (currentPeriodStart + timeframeSeconds) * 1000
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    openPrice: { $first: { $divide: ['$price', '$amount'] } },
                    highPrice: { $max: { $divide: ['$price', '$amount'] } },
                    lowPrice: { $min: { $divide: ['$price', '$amount'] } },
                    closePrice: { $last: { $divide: ['$price', '$amount'] } },
                    volume: { $sum: '$amount' }
                }
            }
        ]).exec();


        if (candlestickData.length === 0) {
            // If no trades, check last candlestick
            if (lastCandlestick) {
                const newCandlestick = new this.candlestickDataModel({
                    liquidityPairId,
                    timeframe,
                    time: currentPeriodStart * 1000,
                    openPrice: lastCandlestick.closePrice,
                    highPrice: lastCandlestick.closePrice,
                    lowPrice: lastCandlestick.closePrice,
                    closePrice: lastCandlestick.closePrice,
                    volume: 0,
                });
                await newCandlestick.save();
            }

            // no last candleStick mean no trades at all
            else {
                // the price is VirtualLiquidity / Initial supply

                const newCandlestick = new this.candlestickDataModel({
                    liquidityPairId,
                    timeframe,
                    time: currentPeriodStart * 1000,
                    openPrice: DEFAULT_PRICE,
                    highPrice: DEFAULT_PRICE,
                    lowPrice: DEFAULT_PRICE,
                    closePrice: DEFAULT_PRICE,
                    volume: 0,
                })
                await newCandlestick.save();
            }
            return;
        }
        else {

            const newCandlestick = new this.candlestickDataModel({
                liquidityPairId,
                timeframe,
                time: currentPeriodStart * 1000,
                openPrice: candlestickData[0].openPrice,
                highPrice: candlestickData[0].highPrice,
                lowPrice: candlestickData[0].lowPrice,
                closePrice: candlestickData[0].closePrice,
                volume: candlestickData[0].volume,
            });
            this.logger.debug('New candlestick', newCandlestick);
            await newCandlestick.save();
        }
    }
}