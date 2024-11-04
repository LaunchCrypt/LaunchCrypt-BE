import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenPriceHistoryDto } from './dto/tokenPriceHistory.dto';
import { CreateTokenDto } from './dto/createToken.dto';

@Controller('token')
export class TokenController {
    constructor(private tokenService: TokenService) { }

    @Get('native-price-history')
    getNativeTokenPriceHistory(
        @Query() query: TokenPriceHistoryDto,
    ) {
        const tokenPriceHistory = this.tokenService.getNativeTokenPriceHistory(
            query.symbol,
            query.interval,
            query.limit,
            query.type
        );
        return { tokenPriceHistory };
    }

    @Post()
    createToken(@Body() createTokenDto: CreateTokenDto) {
        const tokenAddress = this.tokenService.createToken(createTokenDto);
        return { tokenAddress };
    }
}
