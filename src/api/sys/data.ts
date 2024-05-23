import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

enum Api {
  /**
   * 查看数据相关
   */
  getOneField = '/dynamicFormsService/api/v1/dynamicForms/from/getOneField',//获取表头
  getAllDynamicValue = '/dynamicFormsService/api/v1/dynamicForms/value/getAllDynamicValue',//获取数据列表
  AddDynamicValue = '/dynamicFormsService/api/v1/dynamicForms/value/addDynamicValue',
  getOneDynamicValue = '/dynamicFormsService/api/v1/dynamicForms/value/getOne',//获取表头
  UpdataDynamicValue = "/dynamicFormsService/api/v1/dynamicForms/value/updateDynamicValue",
  /**
   * 中心相关
   */
  GetAllTDimDept = "/dynamicFormsService/api/v1/dynamicForms/dept/getAllTDimDept",
}

/**
 * @description: 数据列表 - 获取表头
 */
export function getOneFieldApi(params: {id: string | number, formVersion?: string }, mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.getOneField,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 数据列表 - 获取单条数据
 */
export function getOneDynamicValueApi(params: {valueId: string | number}, mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.getOneDynamicValue,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 数据列表
 */
export function getAllDynamicValueApi(params: {current: number | string, size: number | string, fromId: number | string, sortType: number, param?: string | number}, mode: ErrorMessageMode = 'none') {
  return defHttp.post(
    {
      url: Api.getAllDynamicValue,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 新建表单数据
 */
export function AddDynamicValueApi(params: {fieldValueJson: string, fromId: string | number, joinValue?: number}, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.AddDynamicValue,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 修改表单数据
 */
export function UpdataDynamicValueApi(params: {
  "fieldValueJson"?: JSON | string,
  "fromId"?: string | number,
  "id": string | number, joinValue?: number
}, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.UpdataDynamicValue,
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
export function GetAllTDimDeptApi( mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.GetAllTDimDept,
    },
    {
      errorMessageMode: mode,
    },
  );
}