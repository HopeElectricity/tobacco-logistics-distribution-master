export interface addUserForm {
  user_name: string;
  phone: string;
  email: string;
  department: string;
  role_id: number | undefined;
  work_number: string;
  sign_time: string;
  avatarPath?: string;
}
export interface IUserAuthorityDataType {
  idList: string;
  role_id: number;
}
export interface IUserSearch {
  department?: string;
  userName?: string;
  workNumber?: string;
}
export interface IUserInfo {
  avatar_path:string,
  department: string;
  email: string;
  password: string;
  phone: string;
  role_id: number;
  sign_time: string;
  user_name: string;
  work_number: string;
  position: string;
}

export interface IParamUserInfo {
  user_name: string;
  work_number: string;
  department: string;
  phone: string;
  role_id: number | undefined;
  signTime: string;
  position?: string;
  email: string;
  newPassword?: string;
}

export interface IAllOperations {
  operation_name: string;
  operation_state: string;
  operation_id: number;
}

export interface IOperations {
  operationName: string;
  operationState: string;
  operationId: number;
}

export interface IRole {
  role_name: string;
  role_id: number;
}
export interface UserEditForm {
  phone: string;
  email: string;
  department: string;
  role_id: number;
  sign_time: string;
}
