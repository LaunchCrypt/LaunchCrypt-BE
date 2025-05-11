import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trade } from './schemas/trade.schema';
import { Model } from 'mongoose';
import { QueryAllDto } from '../common/dto/queryAll.dto';
import { CreateTradeDto } from './dto/trade.dto';
import { TradeGateway } from './gateway/trade.gateway';
import { UserService } from '../user/user.service';
import axios from 'axios';

@Injectable()
export class TradeService {
    constructor(
        @InjectModel(Trade.name) private tradeModel: Model<Trade>,
        private userService: UserService,
        private tradeGateWay: TradeGateway,
    ) { }

    async getAllTrade(queryAllDto: QueryAllDto) {
        const { page = 1, limit = 20, sortField, sortOrder = 'asc' } = queryAllDto;
        const skip = (page - 1) * limit;
        const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};

        return await this.tradeModel.find().skip(skip).limit(limit).sort(sort).exec();
    }

    async getAllTradeByUserAddress(address: string) {
        return await this.tradeModel.find({ creator: address }).exec();
    }

    async createTrade(createTradeDto: CreateTradeDto) {
        const newTrade = new this.tradeModel(createTradeDto);
        // update total trade and totalTradeVolume for user
        await this.userService.updateTotalTradeAndTotalTradeVolume(
            createTradeDto.creator,
            createTradeDto.price,
            new Date()
        ); 
        
        const savedTrade = await newTrade.save();

        // emit new message for frontend
        this.tradeGateWay.emitNewTrade(
            createTradeDto.liquidityPairId,
            savedTrade
        );

        return savedTrade;
    }

    async getTotalSwap() {
        return await this.tradeModel.countDocuments().exec();
    }

    async getTotalSwapValue() {
        return await this.tradeModel.aggregate([
            {
                $group: {
                    _id: null,
                    totalSwapValue: { $sum: '$price' }
                }
            }
        ]).exec();
    }

    // In TradeService
    async getLast30DayTradingVolume() {
        const now = new Date();
        const avaxPrice = await this.getNativeTokenPrice('AVAXUSDT');
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Get raw aggregation
        const rawData = await this.tradeModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    dailyVolume: { $sum: "$price" }
                }
            },
            { $sort: { _id: 1 } }
        ]).exec();

        // Build a map for quick lookup
        const volumeMap = {};
        rawData.forEach(item => {
            volumeMap[item._id] = item.dailyVolume;
        });

        // Generate last 30 days with formatted date and volume
        const result = [];
        for (let i = 29; i >= 0; i--) {
            const dateObj = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            // Format as yyyy-MM-dd for lookup
            const isoDate = dateObj.toISOString().slice(0, 10);
            // Format as 'MMM dd' for display
            const displayDate = dateObj.toLocaleString('en-US', { month: 'short', day: '2-digit' });
            result.push({
                date: displayDate,
                volume: volumeMap[isoDate] * avaxPrice || 0
            });
        }
        return result;
    }

    async getNativeTokenPrice(symbol: string) {
        // call API to binance
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        return response.data.price;
    }
}
