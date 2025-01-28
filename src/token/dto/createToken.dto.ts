import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class SocialLinkingDto {
    @IsOptional()
    website: string;

    @IsOptional()
    twitter: string;

    @IsOptional()
    telegram: string;

    @IsOptional()
    discord: string;

    @IsOptional()
    medium: string;
}

export class CreateTokenDto {
    @IsNotEmpty()
    creator: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    symbol: string;

    @IsNotEmpty()
    @IsOptional()
    image: any

    @IsOptional()
    description: string;

    @IsNotEmpty()
    fee: number;

    @IsNotEmpty()
    totalSupply: string; // convert to BigNumber latter\

    type: string = "ERC20";

    @ValidateNested()
    @IsOptional()
    @Type(() => SocialLinkingDto)
    socialLinks: SocialLinkingDto;
}
