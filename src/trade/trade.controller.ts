import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TradeService } from './trade.service';
import { QueryAllDto } from '../common/dto/queryAll.dto';
import { CreateTradeDto } from './dto/trade.dto';

@Controller('trade')
export class TradeController {
    constructor(private tradeService: TradeService) {}
    @Get()
    getAllTrade(@Query() queryAllDto: QueryAllDto) {
        return this.tradeService.getAllTrade(queryAllDto);
    }

    @Get(":address")
    getAllTradeByUserAddress(@Query('address') address: string) {
        return this.tradeService.getAllTradeByUserAddress(address);
    }

    @Post()
    createTrade(@Body() createTradeDto: CreateTradeDto) {
        return this.tradeService.createTrade(createTradeDto);
    }
}
