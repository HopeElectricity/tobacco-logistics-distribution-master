import requests from "../index";
import {
  IUserSearch,
  IUserInfo,
  addUserForm,
  IUserAuthorityDataType,
  IAllOperations,
  IOperations,
  IRole,
} from "@/types/group";
import { IRequest } from "../request/type";
import { IChangePwdForm } from "@/types/personal";

// 添加用户接口
export function postAddUser(userData: addUserForm) {
  return requests.post<IRequest<any>>({
    url: "/userservice/user/add",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: userData,
  });
}
//获取权限点列表接口
export function getAllAuthority() {
  return requests.get<IRequest<IAllOperations[]>>({
    url: "/userservice/user/get/operations",
  });
}

// 获取角色列表
export function getRoles() {
  return requests.get<IRequest<IRole[]>>({
    url: "/userservice/user/get/roles",
  });
}
//设置权限接口
export function setUserAuthority(authority: IUserAuthorityDataType) {
  return requests.post<IRequest<any>>({
    url: "/userservice/user/set",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: authority,
  });
}
// 上传头像
export function userAvatar(data: any) {
  return requests.post<IRequest<string>>({
    url: "/userservice/user/avatar",
    data,
  });
}
// 查询用户

export function getAllUser(searchData: IUserSearch) {
  return requests.get<IRequest<IUserInfo[]>>({
    url: "/userservice/user/search",
    params: searchData,
  });
}

// 获取角色已有权限接口
export function getRoleOperations(role_id: number) {
  return requests.get<IRequest<IOperations[]>>({
    url: `/userservice/user/get/role/operations?role_id=${role_id}`,
  });
}
// 获取编辑的用户信息接口
export function getEditUserInfo(work_number: string) {
  return requests.get<IRequest<IUserInfo[]>>({
    url: `/userservice/user/get?workNumber=${work_number}`,
  });
}
//修改用户信息
export function updateUserInfo(data: IUserInfo) {
  return requests.post<IRequest<string>>({
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    url: "/userservice/user/update",
    data,
  });
}

// 修改用户密码
export function postUpdatePassword(data: IChangePwdForm) {
  return requests.post<IRequest<string>>({
    url: "/userservice/user/update/password",
    data,
  });
}
