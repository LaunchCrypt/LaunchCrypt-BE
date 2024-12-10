import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidateNested } from 'class-validator';
import mongoose from 'mongoose';


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

    @Prop()
    image: File

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: User.name, default: []})
    followers: mongoose.Types.ObjectId[]

    @Prop({type: [mongoose.Schema.Types.ObjectId], ref: User.name, default: []})
    following: mongoose.Types.ObjectId[]

    @Prop({default: 0})
    mentionReceived: number

    @Prop({default: 0})
    likeReceived: number
}

export const UserSchema = SchemaFactory.createForClass(User);   
