import { IsNotEmpty } from 'class-validator';
export class TokenPriceHistoryDto {
    @IsNotEmpty()
    symbol: string;
    
    @IsNotEmpty()
    interval: string;

    @IsNotEmpty()
    limit: number;

    @IsNotEmpty()
    type: "dayMonth" | "time";  
}