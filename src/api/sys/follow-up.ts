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
  getAllTAction = "/dynamicFormsService/api/v1/dynamicForms/action/getAllTAction",
  getAllProjectNotParam = "/dynamicFormsService/api/v1/opt/JDictProject/getAllProjectNotParam",
  getOneRules = "/dynamicFormsService/api/v1/followUp/rules/getOneRules",
  updataRules = "/dynamicFormsService/api/v1/followUp/rules/updataRules",
  deleteRules = "/dynamicFormsService/api/v1/followUp/rules/deleteRules",
  getAllMassage = "/dynamicFormsService/api/v1/followUp/massage/getAllMassage",
  addMassage = "/dynamicFormsService/api/v1/followUp/massage/addMassage",
  updataMassage = "/dynamicFormsService/api/v1/followUp/massage/updataMassage",
  deleteMassage = "/dynamicFormsService/api/v1/followUp/massage/deleteMassage",
  getOneMassage = "/dynamicFormsService/api/v1/followUp/massage/getOneMassage",
  getallMessageInfo = "/dynamicFormsService/api/v1/followUp/massage/getallMessageInfo",
  updataStatus = "/dynamicFormsService/api/v1/followUp/massage/updataStatus",
  getMessageTemplateValue = "/dynamicFormsService/api/v1/followUp/massage/getMessageTemplateValue",
  getAllFeedBack = "/dynamicFormsService/api/v1/dynamicForms/feedBack/getAll",
}
/**
 * @description: 修改随访规则
 * {
  "current": 0,
  "size": 0,
  "countdown": "",
  "endTime": "",
  "startTime": "",
  "expire": 0,
  "fillInStatus": 0,
  "name": "",
  "patientId": "",
  "schedule": "",
}
 */
export function getAllFeedBackApi(params: {current: string | number ,size: string | number ,countdown?: string | number ,endTime?: string | number,startTime?: string | number,expire?: string | number,fillInStatus?: string | number,name?: string | number,patientId?: string | number,schedule?: string | number },mode: ErrorMessageMode = 'none') {
  console.log('params', params);
  return defHttp.post(
    {
      url: Api.getAllFeedBack,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 随访规则单条
 */
export function getMessageTemplateValueApi(params: {value: string },mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.getMessageTemplateValue,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 随访规则单条
 */
export function updataStatusApi(params: {id: string | number, status: string | number },mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.updataStatus,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 随访规则单条
 */
export function getallMessageInfoApi(params: {id: string | number },mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.getallMessageInfo,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 随访规则单条
 */
export function getOneMassageApi(params: {id: string | number },mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.getOneMassage,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 随访规则单条
 */
export function deleteMassageApi(params: {id: string | number },mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.deleteMassage,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 修改随访规则
 */
export function updataMassageApi(params: {current: string | number ,size: string | number ,messageType: string | number ,tempName: string | number },mode: ErrorMessageMode = 'none') {
  console.log('params', params);
  return defHttp.post(
    {
      url: Api.updataMassage,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 修改随访规则
 */
export function addMassageApi(params: {current: string | number ,size: string | number ,messageType: string | number ,tempName: string | number },mode: ErrorMessageMode = 'none') {
  console.log('params', params);
  return defHttp.post(
    {
      url: Api.addMassage,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 修改随访规则
 */
export function getAllMassageApi(params: {current: string | number ,size: string | number ,messageType: string | number ,tempName: string | number },mode: ErrorMessageMode = 'none') {
  console.log('params', params);
  return defHttp.post(
    {
      url: Api.getAllMassage,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 随访规则单条
 */
export function deleteRulesApi(params: {id: string | number },mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.deleteRules,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 修改随访规则
 */
export function updataRulesApi(params: {id: string | number },mode: ErrorMessageMode = 'none') {
  return defHttp.post(
    {
      url: Api.updataRules,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 随访规则单条
 */
export function getOneRulesApi(params: {id: string | number },mode: ErrorMessageMode = 'none') {
  return defHttp.get(
    {
      url: Api.getOneRules,
      params
    },
    {
      errorMessageMode: mode,
    },
  );
}
/**
 * @description: 数据列表 - 获取表头
 */
export function getAllProjectNotParamApi(mode: ErrorMessageMode = 'none') {
  return defHttp.post(
    {
      url: Api.getAllProjectNotParam,
    },
    {
      errorMessageMode: mode,
    },
  );
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
 * {
  "fromId": 0,
  "fromName": "",
  "id": 0,
  "projectCode": "",
  "projectName": "",
  "ruleInfoJson": "",
  "ruleName": "",
  "status": 0,
  "visitCycle": ""
}
 */
export function addRulesApi(params: {fromId?: number | string,fromName?: string, id: number | string, projectCode?: number | string, projectName?: number | string, ruleInfoJson?: string , ruleName?: string,  status?: string | Number, visitCycle?: string}, mode: ErrorMessageMode = 'none') {
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