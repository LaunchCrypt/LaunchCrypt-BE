import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsInt, Min, IsString, IsIn } from "class-validator";

export class QueryAllDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({ required: false, default: 1 })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @ApiProperty({ required: false, default: 10 })
    limit?: number = 10;

    @IsOptional()
    @IsString()
    @ApiProperty({ required: false })
    sortField?: string;

    @IsOptional()
    @IsIn(['asc', 'desc'])
    @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
    sortOrder?: 'asc' | 'desc' = 'asc';
}