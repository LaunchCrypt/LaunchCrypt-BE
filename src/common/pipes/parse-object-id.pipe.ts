import { PipeTransform, Injectable, BadRequestException, HttpCode } from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, Types.ObjectId> {
  transform(value: string): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException({
        code: HttpCode(400),
        message: 'Invalid ObjectId format',
        details: {
          value,
          expected: 'MongoDB ObjectId',
          format: '24 character hex string (12 bytes)',
          example: new Types.ObjectId().toString()
        }
      });
    }

    return new Types.ObjectId(value);
  }
}