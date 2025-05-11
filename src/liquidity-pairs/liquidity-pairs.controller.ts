import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { LiquidityPairsService } from './liquidity-pairs.service';
import { CreateLiquidityPairDto, UpdateLiquidityPairDto } from './dto/createLiquidityPair.dto';
import { QueryAllDto } from '../common/dto/queryAll.dto';

@Controller('liquidity-pairs')
export class LiquidityPairsController {
    constructor(private liquidityPairsService: LiquidityPairsService) {}

    @Get()
    getAllLiquidityPairs(@Query() queryAllDto: QueryAllDto) {
        return this.liquidityPairsService.getAllLiquidityPairs(queryAllDto);
    }

    @Get('contract')
    getLiquidityPairByContractAddress(@Query('contractAddress') contractAddress: string) {
        return this.liquidityPairsService.getLiquidityPairByContractAddress(contractAddress);
    }

    // Token A is new token create in the platform
    @Get('token')
    getLiquidityPairByToken(@Query('address') tokenA: string) {
        return this.liquidityPairsService.getLiquidityPairByToken(tokenA);
    }

    @Post()
    createLiquidityPair(@Body() createLiquidityPairDto: CreateLiquidityPairDto) {
        return this.liquidityPairsService.createLiquidityPair(createLiquidityPairDto);
    }

    @Patch(":contract")
    updateLiquidityPair(@Param('contract') contractAddress: string, @Body() updateLiquidityPairDto: UpdateLiquidityPairDto) {
        return this.liquidityPairsService.updateLiquidityPair(contractAddress, updateLiquidityPairDto);
    }
}
