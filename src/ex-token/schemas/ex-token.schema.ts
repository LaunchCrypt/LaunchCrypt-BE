import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ExTokenDocument = ExToken & Document;
@Schema(
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                delete ret.id;
                delete ret.__v;
                return ret;
            }
        }
    }
)

export class ExToken {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    symbol: string

    @Prop({ required: true })
    contractAddress: string
}

export const ExTokenSchema = SchemaFactory.createForClass(ExToken);