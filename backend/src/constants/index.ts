import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const jwtConstants = {
  secret:
    'delight in every meal app. make it easy to find the best food you want to eat',
};
