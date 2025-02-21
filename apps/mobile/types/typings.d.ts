declare namespace API {
  type BaseResponseType<T> = {
    statusCode: number;
    message: string;
    data: T;
  };
}
