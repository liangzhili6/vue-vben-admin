import { defHttp } from '@/utils/http/axios';
import { AddFromParams, FormManagerParams } from './model/formModel';

import { ErrorMessageMode } from '#/axios';

enum Api {
  AddDynamicFrom = '/dynamicFormsService/api/v1/dynamicForms/from/addDynamicFrom',
  FormManagerList = '/dynamicFormsService/api/v1/dynamicForms/from/getAllDynamicType',
  FormVersionList = "/dynamicFormsService/api/v1/dynamicForms/from/getAlldynamicTypeVersion",
  UpdateDynamicFrom = "/dynamicFormsService/api/v1/dynamicForms/from/updataDynamicFrom",
  UpdataDynamicFromStatus = "/dynamicFormsService/api/v1/dynamicForms/from/updataStatusForId",
  UpdataTypeForId = "/dynamicFormsService/api/v1/dynamicForms/from/updataTypeForId",
  GetOneForm = "/dynamicFormsService/api/v1/dynamicForms/from/getOne",//获取单条表单
  // GetAlldynamicFromName = "/dynamicFormsService/api/v1/dynamicForms/from/getAlldynamicFromName",
  CopyDynamicFrom = "/dynamicFormsService/api/v1/dynamicForms/from/copyDynamicFrom",//复制表单
  DeleteFrom = "/dynamicFormsService/api/v1/dynamicForms/from/deleteFrom",//删除表单
  getAlldynamicFromName = "/dynamicFormsService/api/v1/dynamicForms/from/getAlldynamicFromName",//关联记录下拉
  getRandomOne = "/dynamicFormsService/api/v1/dynamicForms/value/random",//关联记录下拉
  getBaseline = "/dynamicFormsService/api/v1/dynamicForms/from/getBaseline",//关联记录下拉
}

/**
 * @description: 新建表单
 */
export function GetBaselineApi(params: {status: number, formName: string}, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: Api.getBaseline,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
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
export function UpdateDynamicFromApi(params: {
  "formType"?: string,
  "fieldValueJson"?: JSON | string,
  "joinForm"?: string,
  "formName"?: string | number,
  "formVersion"?: string | number,
  "id": string | number
}, mode: ErrorMessageMode = 'modal') {
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
export function UpdataDynamicFromStatusApi(params: {
  "id": string | number,
  "status": number | string,
}, mode: ErrorMessageMode = 'modal') {
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
 * @description: 修改表单type
 */
export function UpdataTypeForIdApi(params: {
  "id": string | number,
  "fromType": string,
}, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: Api.UpdataTypeForId,
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
export function FormVersionListApi(params: {unCode: string | number}, mode: ErrorMessageMode = 'none') {
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
 * @description: 表单单条
 */
export function GetOneFormApi(params: {id: string | number, formVersion: string | number }, mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.GetOneForm,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 复制表单
 */
export function CopyDynamicFromApi(params: {
  "fromId": string | number,
}, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: Api.CopyDynamicFrom,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}


/**
 * @description: 删除表单
 */
export function DeleteFromApi(params: {
  "fromId": string | number,
}, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: Api.DeleteFrom,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 关联记录表单下拉
 * fromId：自己的id
 */
export function getAlldynamicFromNameApi(params: {
  "fromId"?: string | number,
}, mode: ErrorMessageMode = 'modal') {
  return defHttp.get(
    {
      url: Api.getAlldynamicFromName,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}


/**
 * @description: 关联记录关联随机数
 */
export function getRandomOneApi() {
  return defHttp.get(
    {
      url: Api.getRandomOne,
    },
    {
      errorMessageMode: 'none',
    },
  );
}

