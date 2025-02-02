import { IsNotEmpty } from "class-validator";

export class CreateStakeDto {
    @IsNotEmpty()
    staker: string;
    @IsNotEmpty()
    amount: number;
    @IsNotEmpty()
    startTime: number;
    @IsNotEmpty()
    duration: number;
}

export class UpdateStakeDto {
    @IsNotEmpty()
    amount: number;
    @IsNotEmpty()
    startTime: number;
    @IsNotEmpty()
    duration: number;
}

export class DeleteStakeDto {
    @IsNotEmpty()
    staker: string;
}