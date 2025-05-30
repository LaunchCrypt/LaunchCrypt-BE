import { TokenService } from './../token/token.service';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { QueryAllDto } from '../common/dto/queryAll.dto';
import { UpdateUserDto } from './dto/createUser.dto';
import { CustomError } from '../error/customError';
import { Alchemy } from 'alchemy-sdk'
import { alchemyFujiConfig } from '../config/alchemy.config';
import { ethers } from 'ethers';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject(forwardRef(() => TokenService))
        private tokenService: TokenService
    ) { }

    async getAll(userQueryDto: QueryAllDto): Promise<User[]> {
        const { page = 1, limit = 20, sortField, sortOrder = 'asc' } = userQueryDto;
        const skip = (page - 1) * limit;
        const sort = sortField ? { [sortField]: sortOrder === 'asc' ? 1 : -1 } as { [key: string]: 1 | -1 } : {};

        return await this.userModel.find().skip(skip).limit(limit).sort(sort).exec();
    }


    async getByPubKey(publicKey: string): Promise<User> {
        const user = await this.userModel.findOne({ publicKey }).exec();
        if (!user) {
            throw new CustomError('User not found', 404, "User not found");
        }
        return user;
    }

    async getWalletTokens(address: string, chainId: string) {
        let alchemy;
        switch (chainId) {
            case "43113":
                alchemy = new Alchemy(alchemyFujiConfig);
                break;
            default:
                alchemy = new Alchemy(alchemyFujiConfig);
        }
        const balances = await alchemy.core.getTokenBalances(address);
        const userTokenInfo = await this.formatBalanceToTokenInfo(balances.tokenBalances);
        return userTokenInfo;
    }

    async update(publicKey: string, updateUserDto: UpdateUserDto): Promise<User> {
        return this.userModel.findOneAndUpdate({ publicKey }, updateUserDto, { new: true }).exec();
    }

    async create(createUserDto: UpdateUserDto): Promise<User> {
        const createdUser = new this.userModel(createUserDto);
        if(!createdUser.name){
            const count = await this.userModel.countDocuments();
            createdUser.name = `user${count + 1}`;
        }
        return createdUser.save();
    }

    private async formatBalanceToTokenInfo(balances: any[]) {
        const tokensInfo = [];
        for (const balance of balances) {
            try {
                const { name, symbol, image } = await this.tokenService.getTokenByContractAddress(balance.contractAddress);

                const normalizedBalance = ethers.utils.formatUnits(
                    balance.tokenBalance,
                    18
                );

                tokensInfo.push({
                    contractAddress: balance.contractAddress,
                    name,
                    symbol,
                    image,
                    balance: normalizedBalance
                });
            } catch (error) {
                console.error(`Error fetching info for token ${balance.contractAddress}:`, error);
            }
        }

        return tokensInfo;
    }

    async getTotalUser() {
        return await this.userModel.countDocuments().exec();
    }

    async updateTotalTradeAndTotalTradeVolume(address: string, price: number, lastTrade: Date) {
        const user = await this.userModel.findOne({ publicKey: address }).exec();
        if (!user) {
            throw new CustomError('User not found', 404, "User not found");
        }
        user.totalTrade += 1;
        user.totalTradeVolume += Number(price);
        user.lastTrade = lastTrade;
        await user.save();
    }


    async getUserTableData() {
        console.log("hello")
        const users = await this.userModel.find().exec();
        console.log("user", users)
        // calculate last trade by getting last trade of each user
        return users.map(user => ({
            name: user.name,
            address: user.publicKey,
            totalTrade: user.totalTrade,
            totalTradeVolume: user.totalTradeVolume,
            avgTradeSize: user.totalTradeVolume / user.totalTrade,
            lastTrade: user.lastTrade
        }));
    }
}
