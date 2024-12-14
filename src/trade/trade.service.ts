import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trade } from './schemas/trade.schema';
import { Model } from 'mongoose';
import { QueryAllDto } from 'src/common/dto/queryAll.dto';
import { CreateTradeDto } from './dto/trade.dto';
import { TradeGateway } from './gateway/trade.gateway';

@Injectable()
export class TradeService {
    constructor(
        @InjectModel(Trade.name) private tradeModel: Model<Trade>,
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
        const savedTrade = await newTrade.save();

        // emit new message for frontend
        this.tradeGateWay.emitNewTrade(
            createTradeDto.LiquidityPairId,
            savedTrade
        );

        return savedTrade;
    }
}
