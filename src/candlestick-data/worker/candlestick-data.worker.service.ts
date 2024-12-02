import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CandlestickData } from "../schemas/candlestickData.schema";
import { LiquidityPair } from "src/liquidity-pairs/schemas/liquidityPairs.schema";
import { Trade } from "src/trade/schemas/trade.schema";

@Injectable()
export class CanddlestickWorkerService {
    private readonly logger = new Logger(CanddlestickWorkerService.name);

    constructor(
        @InjectModel(CandlestickData.name) private candlestickDataModel: Model<CandlestickData>,
        @InjectModel(LiquidityPair.name) private liquidityPairModel: Model<LiquidityPair>,
        @InjectModel(Trade.name) private tradeModel: Model<Trade>,
    ) {
    }

    private readonly timeframes = {
        "3m": 60,
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
            for (const pair in pairs) {
                await this.generateCandlestickData((pair as any)._id, '3m');
            }
        } catch (error) {
            this.logger.error('Error generating 3 minutes candlestick data', error);
        }
    }

    private async generateCandlestickData(
        liquidityPairId: Types.ObjectId,
        timeframe: string
    ) {
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
                    openPrice: { $first: '$price' },
                    highPrice: { $max: '$price' },
                    lowPrice: { $min: '$price' },
                    closePrice: { $last: '$price' },
                    volume: { $sum: '$amount' }
                }
            }
        ]).exec();


        if (candlestickData.length === 0) {
            // If no trades, check last candlestick
            const lastCandlestick = await this.candlestickDataModel.findOne({
                liquidityPairId,
                timeframe
            }).sort({ time: -1 }).exec();

            if (lastCandlestick) {
                const newCandlestick = new this.candlestickDataModel({
                    liquidityPairId,
                    timeframe,
                    time: currentPeriodStart,
                    openPrice: lastCandlestick.openPrice,
                    highPrice: lastCandlestick.highPrice,
                    lowPrice: lastCandlestick.lowPrice,
                    closePrice: lastCandlestick.closePrice,
                    volume: 0,
                });
                await newCandlestick.save();
            }
            return;
        }
    }
}