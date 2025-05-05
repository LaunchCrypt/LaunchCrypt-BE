import { IsNotEmpty } from "class-validator";
export class CreateExTokenDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    symbol: string;

    @IsNotEmpty()
    contractAddress: string;
}
    