import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { StakeService } from './stake.service';
import { CreateStakeDto, UpdateStakeDto } from './dto/stake.dto';

@Controller('stake')
export class StakeController {
    constructor(private stakeService: StakeService) { }

    @Get(":staker")
    getStakeByStakerAddress(@Param('staker') staker: string) {
        return this.stakeService.getStakeByStakerAddress(staker);
    }

    @Post()
    createStakeByStakerAddress(@Body() createStakeDto: CreateStakeDto) {
        return this.stakeService.createStakeByStakerAddress(createStakeDto);
    }

    @Patch(":staker")
    updateStakeByStakerAddress(@Param('staker') staker: string, @Body() updateStakeDto: UpdateStakeDto) {
        return this.stakeService.updateStakeByStakerAddress(staker, updateStakeDto);
    }

    @Delete(":staker")
    deleteStakeByStakerAddress(@Param('staker') staker: string) {
        return this.stakeService.deleteStakeByStakerAddress(staker);
    }
}
