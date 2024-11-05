import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenPriceHistoryDto } from './dto/tokenPriceHistory.dto';
import { CreateTokenDto } from './dto/createToken.dto';

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

    @Post()
    createToken(@Body() createTokenDto: CreateTokenDto) {
        return this.tokenService.createToken(createTokenDto);
    }
}
