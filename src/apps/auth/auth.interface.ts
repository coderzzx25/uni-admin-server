import { ExecutionContext } from '@nestjs/common';

export interface IUserAttributes {
  id: number;
  username: string;
  password: string;
  workNo: string;
  cnName: string;
  enName: string;
  age: number;
  email: string;
  phone: string;
  avatarUrl: string;
  sex: number;
  status: number;
  positionId: number;
  departmentId: number;
  roleId: number;
  token?: string;
  refreshToken?: string;
}

// session存储的数据类型
export interface ISessionTypes {
  verifyCode: string;
  currentUserInfo: IUserAttributes;
}

// 账户登录信息
export interface ILoginData {
  username: string; // 用户名
  password: string; // 密码
  verifyCode: string; // 验证码
}

// 账户登录返回信息
export interface ILoginResult {
  id: number;
  token: string;
  refreshToken: string;
}

export interface ICanActivate extends ExecutionContext {
  user: IUserAttributes;
}
