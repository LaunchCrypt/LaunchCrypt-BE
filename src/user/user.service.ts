import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { QueryAllDto } from 'src/common/dto/queryAll.dto';
import { UpdateUserDto } from './dto/createUser.dto';
import { CustomError } from 'src/error/customError';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ){}

    async getAll(userQueryDto: QueryAllDto): Promise<User[]> {
        const { page = 1, limit = 20, sortField, sortOrder = 'asc' } = userQueryDto;
        const skip = (page - 1) * limit;
        const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};

        return await this.userModel.find().skip(skip).limit(limit).sort(sort).exec();
    }


    async getByPubKey(publicKey: string): Promise<User> {
        const user = await this.userModel.findOne({ publicKey }).exec();
        if (!user) {
            throw new CustomError('User not found',404, "User not found");
        }
        return user;
    }

    async update(publicKey: string, updateUserDto: UpdateUserDto): Promise<User> {
        return this.userModel.findOneAndUpdate({ publicKey }, updateUserDto, { new: true }).exec();
    }

    async create(createUserDto: UpdateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        return createdUser.save();
    }
}
