/**
 * 生成 4 位随机验证码
 * @returns random code
 */

import type { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';

export const getRandomCode = (): string => {
  const max = 9999;
  const min = 1000;
  const code = Math.floor(Math.random() * (max - min)) + min;
  return code.toString();
};

export const getAccessRefreshToken = async (
  service: JwtService,
  payload: { [key: string]: string },
  assetExpiresIn: string,
  refreshExpiresIn: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  const accessToken = await service.signAsync(payload, {
    secret: jwtConstants.secret,
    expiresIn: assetExpiresIn,
  });

  const refreshToken = await service.signAsync(payload, {
    secret: jwtConstants.secret,
    expiresIn: refreshExpiresIn,
  });

  return {
    accessToken,
    refreshToken,
  };
};
