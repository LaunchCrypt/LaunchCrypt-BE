import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { LiquidityPairsService } from './liquidity-pairs.service';
import { ParseObjectIdPipe } from 'src/common/pipes/parse-object-id.pipe';
import { CreateLiquidityPairDto } from './dto/createLiquidityPair.dto';
import { QueryAllDto } from 'src/common/dto/queryAll.dto';

@Controller('liquidity-pairs')
export class LiquidityPairsController {
    constructor(private liquidityPairsService: LiquidityPairsService) {}

    @Get()
    getAllLiquidityPairs(@Query() queryAllDto: QueryAllDto) {
        return this.liquidityPairsService.getAllLiquidityPairs(queryAllDto);
    }

    @Get(':contractAddress')
    getLiquidityPairByContractAddress(@Param('contractAddress') contractAddress: string) {
        return this.liquidityPairsService.getLiquidityPairByContractAddress(contractAddress);
    }

    // Token A is new token create in the platform
    @Get()
    getLiquidityPairByTokenA(@Query('token0') token0: string) {
        return this.liquidityPairsService.getLiquidityPairByTokenA(token0);
    }

    @Post()
    createLiquidityPair(@Body() createLiquidityPairDto: CreateLiquidityPairDto) {
        return this.liquidityPairsService.createLiquidityPair(createLiquidityPairDto);
    }
}
