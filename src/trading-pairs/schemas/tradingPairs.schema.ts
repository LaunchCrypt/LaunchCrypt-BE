
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExTokenSchema, ExToken } from 'src/ex-token/schemas/ex-token.schema';

// export type MskProblemDocument = HydratedDocument<MskProblem>;

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
export class TradingPair {
    @Prop({ required: true })
    creator: string;

    // tokenA is new token create in the platform
    @Prop({ required: true, type: ExTokenSchema })
    tokenA: ExToken;

    @Prop({ required: true, type: ExTokenSchema })
    tokenB: ExToken;

    @Prop({ required: true })
    tokenAReserve: string;

    @Prop({ required: true })
    tokenBReserve: string;

    @Prop({ required: true })
    chainId: number;

    @Prop({ required: true })
    poolAddress: string;

    @Prop({ required: true })
    totalLP: string;
}

export const TradingPairSchema = SchemaFactory.createForClass(TradingPair);
