
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
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
export class Trade {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: LiquidityPair.name })
    liquidityPairId: Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Token' })
    tokenId: Types.ObjectId

    // in native token
    @Prop()
    price: number

    // in ERC20 token
    @Prop()
    amount: number

    @Prop({ required: true, default: () => Date.now()})
    timestamp: number //Unix timestamp in milliseconds

    @Prop()
    side: 'buy' | 'sell'

    // store pubKey only
    @Prop()
    creator: string

    @Prop()
    transactionHash: string
}

export const TradeSchema = SchemaFactory.createForClass(Trade);

TradeSchema.index({ liquidityPairId: 1, timestamp: -1 });