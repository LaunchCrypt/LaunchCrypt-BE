import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LiquidityPair } from '../../liquidity-pairs/schemas/liquidityPairs.schema';
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
        },
        toObject: { virtuals: true }
    }
)

export class Chat {
    @Prop({ required: true })
    creator: string;

    @Prop({ required: true })
    message: string;

    @Prop({ required: true, default: () => Date.now()})
    timestamp: number

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'LiquidityPair' })
    liquidityPair: LiquidityPair

    @Prop()
    loveCount: number

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: false })
    parent: string
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.virtual('children', {
    ref: 'Chat',
    localField: '_id',
    foreignField: 'parent'
})

ChatSchema.virtual('creatorInfo', {
    ref: 'User',  
    localField: 'creator',  
    foreignField: 'publicKey',  
    justOne: true,
    get: function(user) {
        return {
            image: user?.image || null ,
            name: user.name
        }  // Return only the image field
    }
});



