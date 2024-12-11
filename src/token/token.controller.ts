import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenPriceHistoryDto } from './dto/tokenPriceHistory.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryAllDto } from 'src/common/dto/queryAll.dto';

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
    @UseInterceptors(FileInterceptor('image'))
    createToken(@UploadedFile() image: Express.Multer.File,
        @Body() body: { data: string }) {

        const tokenData = JSON.parse(body.data);
        return this.tokenService.createToken({
            ...tokenData,
            image
        });
    }

    @Get()
    getAllTokens(@Query() queryAllDto: QueryAllDto) {
        return this.tokenService.getAllTokens(queryAllDto);
    }
}
