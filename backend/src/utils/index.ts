import { jwtConstants } from 'src/constants';

import type { JwtService } from '@nestjs/jwt';

/**
 * 生成 4 位随机验证码
 * @returns random code
 */
export const getRandomCode = (): string => {
  const max = 9999;
  const min = 1000;
  const code = Math.floor(Math.random() * (max - min)) + min;
  return code.toString();
};

/**
 * 获取 access token 和 refresh token
 * @param service
 * @param payload
 * @param assetExpiresIn
 * @param refreshExpiresIn
 * @returns access token and refresh token
 */
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
