import { defHttp } from '@/utils/http/axios';
import { LoginParams, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/dynamicFormsService/api/v1/u4a/auth/login',
  Logout = '/dynamicFormsService/api/v1/u4a/auth/logout',
  // GetUserInfo = UserCode_EnumToString,
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}
/* export function UserCode_EnumToString(userCode: string ) {
  return `/dynamicFormsService/api/v1/u4a/users/${userCode}/detail`;
} */
/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo(userCode) {
  return defHttp.get<GetUserInfoModel>({ url: `/dynamicFormsService/api/v1/u4a/users/${userCode}/detail` }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.post({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
