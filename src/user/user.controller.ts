import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { QueryAllDto } from 'src/common/dto/queryAll.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Get()
    getAll(@Query() userQueryDto: QueryAllDto): Promise<User[]> {
        return this.userService.getAll(userQueryDto);
    }

    @Get(':publicKey')
    getByPubKey(@Param('publicKey') publicKey: string): Promise<User> {
        return this.userService.getByPubKey(publicKey);
    }

    @Get('token/:publicKey/:chainId')
    getWalletTokens(
        @Param('publicKey') publicKey: string,
        @Param('chainId') chainId: string
    ): Promise<any> {
        return this.userService.getWalletTokens(publicKey, chainId);
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    @Patch(':publicKey')
    @UseInterceptors(FileInterceptor('image'))
    update(
        @UploadedFile() image: Express.Multer.File,
        @Param('publicKey') publicKey: string,
        @Body() updateUserDto: {
            publicKey: string
            name: string
            bio: string
            followers: string
            following: string
            mentionReceived: number
            likeReceived: number
        }
    ): Promise<User> {
        const userData = JSON.parse(JSON.stringify(updateUserDto));
        return this.userService.update(publicKey, {
            ...userData,
            image
        });
    }
}

