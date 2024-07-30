import { Body, Controller, Post } from '@nestjs/common';
import { UniswapService } from './uniswap.service';
@Controller('uniswap')
export class UniswapController {
    constructor(private uniswapService: UniswapService) {}

    @Post()
    async createUniswapPool(@Body() poolData: any) {
        const poolAddress = await this.uniswapService.createLiquidityPool(
            poolData.token0Address,
            poolData.token1Address,
            poolData.fee,
            poolData.initialToken0Amount,
            poolData.initialToken1Amount,
        );
        return {poolAddress};
    }
}
