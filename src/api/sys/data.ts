import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';
import { NumberFormatProps } from 'vue-i18n';

enum Api {
  /**
   * 查看数据相关
   */
  getOneField = '/dynamicFormsService/api/v1/dynamicForms/from/getOneField',//获取表头
  getAllDynamicValue = '/dynamicFormsService/api/v1/dynamicForms/value/getAllDynamicValue',//获取数据列表
  AddDynamicValue = '/dynamicFormsService/api/v1/dynamicForms/value/addDynamicValue',
  getOneDynamicValue = '/dynamicFormsService/api/v1/dynamicForms/value/getOne',//获取表头
  UpdataDynamicValue = "/dynamicFormsService/api/v1/dynamicForms/value/updateDynamicValue",
  DeleTeDynamicValue = "/dynamicFormsService/api/v1/dynamicForms/value/deleteOrRetractValue",
  /**
   * 中心相关
   */
  GetAllTDimDept = "/dynamicFormsService/api/v1/dynamicForms/dept/getAllTDimDept",
  GetAllTCenter = "/dynamicFormsService/api/v1/opt/center/getAllTCenter",
  GetAllUser = "/dynamicFormsService/api/v1/u4a/users/pagination",
  ExportExcel = "/dynamicFormsService/api/v1/dynamicForms/value/exportDynamicValue"
}

/**
 * @description: 数据列表 - 获取表头
 */
export function getOneFieldApi(params: {id?: string | number, formVersion?: string, formName?: string }, mode: ErrorMessageMode = 'none') {
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
export function getAllDynamicValueApi(params: {current: number | string, size: number | string, fromId: number | string, sortType: number, param?: string | number, conditions?: any, fromName?: string, followUpStatus?: string | Number, followUpFinish?: Number}, mode: ErrorMessageMode = 'none') {
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
 * @description: 删除/撤回表单数据
 * fromId	表单id
 * 	type 0撤回 1删除
 */
export function DeleTeDynamicValueApi(params: { fromId: any, id: any, type: any}, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: Api.DeleTeDynamicValue,
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
  formName?: string,
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

/**
 * @description: 查询所有中心
 */
export function GetAllTCenterApi(mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.GetAllTCenter,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 查询所有用户、成员
 */
export function GetAllUserApi( params: {
  "current"?: number | string,
  "size"?: string | number,
}, mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.GetAllUser,
      params: {
        current:1,
        size: 999,
      },
    },
    {
      errorMessageMode: mode,
    },
  );
}

  /**
   * 导出 Excel
   * @param {*} data 
   * @returns 
   */
  export function ExportExcelApi( params: {
    conditions?: any,
    fieldJson?: string | number,
    formInfo?:any,
    param?: string | number,
  }, mode: ErrorMessageMode = 'none') {
    return defHttp.post({
      url: Api.ExportExcel,
      params,
      isDownLoadFile:true,
    })
   }