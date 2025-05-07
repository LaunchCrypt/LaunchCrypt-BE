import { QueryAllDto } from 'src/common/dto/queryAll.dto';
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TradingPairsService } from './trading-pairs.service';
import { CreateTradingPairDto, UpdateTradingPairDto } from './dto/createTradingPair.dto';
import { TokenService } from 'src/token/token.service';

@Controller('trading-pairs')
export class TradingPairsController {
    constructor(private tradingPairService: TradingPairsService
     ) {}

    @Get()
    getAllTradingPairs(@Query() queryAllDto: QueryAllDto) {
        return this.tradingPairService.getAllTradingPairs(queryAllDto);
    }

    @Get('token')
    getTradingPairsByToken(@Query('address') tokenA: string) {
        return this.tradingPairService.getTradingPairsByToken(tokenA);
    }

    @Get('contract')
    getTradingPairsByContract(@Query('contractAddress') contractAddress: string) {
        return this.tradingPairService.getTradingPairsByContract(contractAddress);
    }

    @Get('token-pair')
    getTradingPairsByTokenPair(@Query('tokenA') tokenA: string, @Query('tokenB') tokenB: string) {
        return this.tradingPairService.getTradingPairsByTokenPair(tokenA, tokenB);
    }

    @Post()
    createTradingPair(@Body() createTradingPairDto: CreateTradingPairDto) {
        return this.tradingPairService.createTradingPair(createTradingPairDto);
    }

    @Patch(':contract')
    updateTradingPairReserve(@Param('contract') contractAddress: string, @Body() updateTradingPairDto: UpdateTradingPairDto) {
        return this.tradingPairService.updateTradingPairReserve(contractAddress, updateTradingPairDto);
    }
}

   


