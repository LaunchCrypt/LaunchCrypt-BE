import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidateNested } from 'class-validator';
import mongoose from 'mongoose';
import { Token } from '../../token/schemas/token.schema';


export type UserDocument = User & Document;

@Schema(
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: function (doc, ret) {
                delete ret._id;
                delete ret.__v;
            },
        },
    }
)

export class User {
    @Prop({ required: true })
    publicKey: string

    @Prop()
    name: string

    @Prop()
    bio: string

    @Prop({ type: Object })
    image: Express.Multer.File

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: User.name, default: []})
    followers: mongoose.Types.ObjectId[]

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: User.name, default: []})
    following: mongoose.Types.ObjectId[]

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: Token.name, default: [] })
    tokenFollow: mongoose.Types.ObjectId[]

    @Prop({default: 0})
    mentionReceived: number

    @Prop({default: 0})
    likeReceived: number

    @Prop({default: 0})
    totalTrade: number

    @Prop({default: 0})
    totalTradeVolume: number

    @Prop()
    lastTrade: Date
}

export const UserSchema = SchemaFactory.createForClass(User);   
