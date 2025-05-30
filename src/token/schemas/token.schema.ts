
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ValidateNested } from 'class-validator';
import { SocialLinkingDto } from '../dto/createToken.dto';

// export type MskProblemDocument = HydratedDocument<MskProblem>;
export type TokenDocument = Token & Document;

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
export class Token {
    @Prop({ required: true })
    name: string

    @Prop({required: true})
    symbol: string

    @Prop({ type: Object })
    image: Express.Multer.File

    @Prop({default: "ERC20"})
    type: string = "ERC20"

    @Prop()
    description: string

    @Prop()
    fee: number

    @Prop({required: true})
    totalSupply: string

    @Prop()
    @ValidateNested()
    socialLinks: SocialLinkingDto

    @Prop()
    contractAddress: string

    @Prop()
    chainId: number
}

export const TokenSchema = SchemaFactory.createForClass(Token);
