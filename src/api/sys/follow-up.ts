import { defHttp } from '@/utils/http/axios';

import { ErrorMessageMode } from '#/axios';

enum Api {
  /**
   * 随访规则
   */
  getAllRules = '/dynamicFormsService/api/v1/followUp/rules/getAllRules',//随访规则列表
  addRules = "/dynamicFormsService/api/v1/followUp/rules/addRules",
  GetAllTCenter = "/dynamicFormsService/api/v1/opt/center/getAllTCenter",
  GetAllUser = "/dynamicFormsService/api/v1/u4a/users/pagination",
  ExportExcel = "/dynamicFormsService/api/v1/dynamicForms/value/exportDynamicValue",
  getAllTAction = "/dynamicFormsService/api/v1/dynamicForms/action/getAllTAction"
}

/**
 * @description: 数据列表 - 获取表头
 */
export function getAllRulesApi(params: {current?: string | number, size?: string | number, status?: string, projectName?: string, ruleName?: string }, mode: ErrorMessageMode = 'none') {
  return defHttp.post(
    {
      url: Api.getAllRules,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 数据列表 - 规则列表
 */
export function getAllTActionApi(params: {current?: string | number, size?: string | number, status?: string, projectName?: string, ruleName?: string }, mode: ErrorMessageMode = 'none') {
  return defHttp.post(
    {
      url: Api.getAllTAction,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 新增随访规则
 */
export function addRulesApi(params: {current: number | string, size: number | string, fromId: number | string, sortType: number, param?: string | number, conditions?: any, fromName?: string, followUpStatus?: string | Number, followUpFinish?: Number}, mode: ErrorMessageMode = 'none') {
  return defHttp.post(
    {
      url: Api.addRules,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}