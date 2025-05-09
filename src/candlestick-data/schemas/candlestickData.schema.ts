
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LiquidityPair } from 'src/liquidity-pairs/schemas/liquidityPairs.schema';

@Schema(
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
)
export class CandlestickData {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: LiquidityPair.name })
    liquidityPairId: mongoose.Types.ObjectId;

    @Prop()
    timeframe: string;

    @Prop()
    time: number

    @Prop()
    openPrice: number;

    @Prop()
    closePrice: number;

    @Prop()
    highPrice: number;

    @Prop()
    lowPrice: number;

    @Prop()
    volume: string;
}

export const CandlestickDataSchema = SchemaFactory.createForClass(CandlestickData);

CandlestickDataSchema.index({ liquidityPairId: 1, timeframe: 1, time: -1 });



