import { IsNotEmpty, IsOptional, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateTokenDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    symbol: string;

    @IsNotEmpty()
    image: File;

    @IsOptional()
    description: string;

    @IsNotEmpty()
    fee: number;

    @IsNotEmpty()
    totalSupply: number;

    @ValidateNested()
    @IsOptional()
    @Type(()=> SocialLinkingDto)
    socialLinks: SocialLinkingDto;

}

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