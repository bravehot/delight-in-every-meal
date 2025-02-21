import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (_: undefined, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    if (!request.user?.userId) {
      throw new HttpException(
        'UserId not found in request',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return request.user.userId;
  },
);
