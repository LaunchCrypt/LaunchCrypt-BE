import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    publicKey: string

    @IsOptional()
    name: string

    @IsOptional()
    bio: string

    @IsOptional()
    image: File

    @IsOptional()
    followers: string[]

    @IsOptional()
    following: string[]

    @IsOptional()
    mentionReceived: number

    @IsOptional()
    likeReceived: number
}

export class UpdateUserDto extends CreateUserDto{};