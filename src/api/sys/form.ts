import { defHttp } from '@/utils/http/axios';
import { AddFromParams, GetFromInfoModel, FormManagerParams } from './model/formModel';

import { ErrorMessageMode } from '#/axios';

enum Api {
  AddDynamicFrom = '/dynamicFormsService/api/v1/dynamicForms/from/addDynamicFrom',
  FormManagerList = '/dynamicFormsService/api/v1/dynamicForms/from/getAllDynamicType',
  FormVersionList = '/dynamicFormsService/api/v1/dynamicForms/from/getAlldynamicTypeVersion',
  UpdateDynamicFrom = '/dynamicFormsService/api/v1/dynamicForms/from/updataDynamicFrom',
  UpdataDynamicFromStatus = '/dynamicFormsService/api/v1/dynamicForms/from/updataStatusForId',
}
/* export function UserCode_EnumToString(userCode: string ) {
  return `/dynamicFormsService/api/v1/u4a/users/${userCode}/detail`;
} */
/**
 * @description: 新建表单
 */
export function AddDynamicFromApi(params: AddFromParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.AddDynamicFrom,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 修改表单
 */
export function UpdateDynamicFromApi(
  params: {
    createBy?: string | number;
    fieldValueJson?: JSON | string;
    formName?: string | number;
    formVersion?: string | number;
    id: string | number;
  },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.post(
    {
      url: Api.UpdateDynamicFrom,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 修改表单状态
 */
export function UpdataDynamicFromStatusApi(
  params: {
    id: string | number;
    status: number | string;
  },
  mode: ErrorMessageMode = 'modal',
) {
  return defHttp.get(
    {
      url: Api.UpdataDynamicFromStatus,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 表单管理列表
 */
export function FormManagerListApi(params: FormManagerParams, mode: ErrorMessageMode = 'none') {
  return defHttp.post(
    {
      url: Api.FormManagerList,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 表单管理列表
 */
export function FormVersionListApi(
  params: { unCode: string | number },
  mode: ErrorMessageMode = 'none',
) {
  return defHttp.get(
    {
      url: Api.FormVersionList,
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
  return defHttp.get<GetFromInfoModel>(
    { url: `/dynamicFormsService/api/v1/u4a/users/${userCode}/detail` },
    { errorMessageMode: 'none' },
  );
}

/* export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
} */

/* export function testRetry() {
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
 */
