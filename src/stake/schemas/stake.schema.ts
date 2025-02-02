import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';   

@Schema(
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                delete ret.__v;
                return ret;
            }
        }
    }
)

export class Stake {
    @Prop({ required: true })
    staker: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    startTime: number; // unix timestamp

    @Prop({ required: true })
    duration: number; // in days
}

export const StakeSchema = SchemaFactory.createForClass(Stake);