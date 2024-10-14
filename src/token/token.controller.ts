import { Controller, Get, Query } from '@nestjs/common';
import { TokenService } from './token.service';

@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) { }

    @Get('native-price-history')
    async getNativeTokenPriceHistory(
        @Query('symbol') symbol: string,
        @Query('interval') interval: string,
        @Query('limit') limit: number,
        @Query('type') type: "dayMonth" | "time"
    ) {
        const tokenPriceHistory = await this.tokenService.getNativeTokenPriceHistory(
            symbol,
            interval,
            limit,
            type
        );
        return { tokenPriceHistory };
    }
}
