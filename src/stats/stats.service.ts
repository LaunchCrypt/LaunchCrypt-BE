import { Injectable } from '@nestjs/common';
import { TradeService } from 'src/trade/trade.service';
import { UserService } from 'src/user/user.service';
import { StakeService } from 'src/stake/stake.service';
import axios from 'axios';

@Injectable()
export class StatsService {
    constructor(
        private tradeService: TradeService,
        private userService: UserService,
        private stakeService: StakeService
    ) { }
    // return total swap, total user and total lock value
    async getStats() {
        let totalSwap = await this.tradeService.getTotalSwap();
        let totalUser = await this.userService.getTotalUser();
        let totalLockValue = await this.stakeService.getTotalLockValue();
        let totalSwapValue = await this.tradeService.getTotalSwapValue();
        let last30DayTradingVolume = await this.tradeService.getLast30DayTradingVolume();
        const avaxPrice = await this.getNativeTokenPrice('AVAXUSDT');
        return { totalSwap, totalUser, totalLockValue: totalLockValue[0].totalLockValue * avaxPrice,
            totalSwapValue: parseFloat((totalSwapValue[0].totalSwapValue * avaxPrice).toFixed(2)),
            last30DayTradingVolume
        };
    }

    async getNativeTokenPrice(symbol: string) {
        // call API to binance
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        return response.data.price;
    }
}   
