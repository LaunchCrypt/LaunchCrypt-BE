import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ExTokenService } from './ex-token.service';
import { QueryAllDto } from '@/common/dto/queryAll.dto';
import { CreateExTokenDto } from './dto/createExToken.dto';

@Controller('ex-token')
export class ExTokenController {
    constructor(private exTokenService: ExTokenService) { }
    @Get()
    getAllExToken(@Query() queryAllDto:QueryAllDto) {
        return this.exTokenService.getAllExToken(queryAllDto);
    }

    @Get('contractAddress/:contractAddress')
    getExTokenByContractAddress(@Param('contractAddress') contractAddress: string) {
        return this.exTokenService.getExTokenByContractAddress(contractAddress);
    }

    @Post()
    createExToken(@Body() createExTokenDto: CreateExTokenDto) {
        return this.exTokenService.createExToken(createExTokenDto);
    }
}
