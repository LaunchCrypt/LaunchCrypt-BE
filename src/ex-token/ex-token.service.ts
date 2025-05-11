import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ExToken, ExTokenDocument } from './schemas/ex-token.schema';
import { Model } from 'mongoose';
import { QueryAllDto } from '@/common/dto/queryAll.dto';
import { CreateExTokenDto } from './dto/createExToken.dto';
    
@Injectable()
export class ExTokenService {
    constructor(
        @InjectModel(ExToken.name) private exTokenModel: Model<ExTokenDocument>,
    ) { }

    async getAllExToken(queryAllDto: QueryAllDto) {
        const { page = 1, limit = 20, sortField, sortOrder = 'asc' } = queryAllDto;
        const skip = (page - 1) * limit;
        const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};

        return await this.exTokenModel.find().skip(skip).limit(limit).sort(sort).exec();
    }

    async getExTokenByContractAddress(contractAddress: string) {
        return this.exTokenModel.findOne({ contractAddress });
    }

    async createExToken(createExTokenDto: CreateExTokenDto) {
        const exToken = new this.exTokenModel(createExTokenDto);
        return exToken.save();
    }
}
