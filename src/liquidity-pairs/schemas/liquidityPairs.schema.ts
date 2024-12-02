
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Token, TokenSchema } from 'src/token/schemas/token.schema';

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
export class LiquidityPair {
    @Prop({ required: true })
    creator: string;

    @Prop({ required: true, default: 0 })
    comments: number //the number of total comments

    // tokenA is new token create in the platform
    @Prop({ required: true, type: TokenSchema })
    tokenA: Token;

    @Prop({ required: true })
    tokenAReserve: string;

    @Prop({ required: true })
    tokenBReserve: string;

    @Prop({ required: true })
    chainId: number;

    @Prop({ required: true })
    poolAddress: string;
}

export const LiquidityPairSchema = SchemaFactory.createForClass(LiquidityPair);
