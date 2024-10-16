import { Controller, Get, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenPriceHistoryDto } from './dto/tokenPriceHistory.dto';

@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) { }

    @Get('native-price-history')
    async getNativeTokenPriceHistory(
        @Query() query: TokenPriceHistoryDto,
    ) {
        const tokenPriceHistory = await this.tokenService.getNativeTokenPriceHistory(
            query.symbol,
            query.interval,
            query.limit,
            query.type
        );
        return { tokenPriceHistory };
    }
}
