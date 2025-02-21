import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export const DEFAULT_TOKEN_COUNT = 10000;
export const DEFAULT_COSUMER_COUNT = 2000;
export const DEFAULT_POINT_COUNT = 0;

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
