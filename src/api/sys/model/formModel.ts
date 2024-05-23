/**
 * @description: Login interface parameters
 */
export interface AddFromParams {
  fieldValueJson: any;
  formName: string;
  joinForm?: string,
}
export interface FormManagerParams {
  current: string | number;
  size: string | number;
  formName: string;
  sortType?: string | number;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  // userId: string | number;
  token: string;
  // roles: RoleInfo[];
}

/**
 * @description: Get user information return value
 */
export interface GetFromInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
