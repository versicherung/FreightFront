// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import umiRequest from 'umi-request';

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取订单列表 GET /api/insurance */
export async function order(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.OrderList>('/api/insurance', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取订单详情 GET /api/insurance/detail */
export async function orderDetail(
  params: {
    // query
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.OrderDetail>('/api/insurance/detail', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

// 导出 Excel 表格 GET /api/insurance/export
export async function exportExcel(params: { startTime?: string; endTime?: string; id?: number[] }) {
  return umiRequest('/api/insurance/export', {
    responseType: 'blob',
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 创建订单 POST /api/insurance
export async function createOrder(params: API.CreateOrderParams) {
  return request('/api/insurance', {
    method: 'POST',
    data: params,
  });
}

// 获取用户列表 GET /api/user
export async function userList(params: API.UserListParams) {
  return request('/api/user', {
    method: 'GET',
    params: params,
  });
}

// 创建用户 POST /api/user
export async function addUser(params: API.AddUserParams) {
  return request('/api/user', {
    method: 'POST',
    data: params,
  });
}

// 删除用户 DELETE /api/user
export async function deleteUser(params: API.DeleteUserParams) {
  return request('/api/user', {
    method: 'DELETE',
    data: params,
  });
}

// 修改用户 PUT /api/user
export async function updateUser(params: API.UpdateUserParams) {
  return request('/api/user', {
    method: 'PUT',
    data: params,
  });
}

// 修改用户密码 POST /api/user/changePasswd
export async function updateOwnPassword(params: API.UpdateOwnPasswordParams) {
  return request('/api/user/changePasswd', {
    method: 'POST',
    data: params,
  });
}

// 下载附件 GET /api/download/evidence
export async function exportEvidence(params: { ids?: number[] }) {
  return umiRequest('/api/download/evidence', {
    responseType: 'blob',
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 下载保单 GET /api/download/policy
export async function exportPolicy(params: { ids?: number[] }) {
  return umiRequest('/api/download/policy', {
    responseType: 'blob',
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 下载投保单 GET /api/download/overInsurancePolicy
export async function exportOverPolicy(params: { ids?: number[]; downloadType: number }) {
  return umiRequest('/api/download/overInsurancePolicy', {
    responseType: 'blob',
    method: 'GET',
    params: {
      ...params,
    },
  });
}

// 获取保单列表 表格 GET /api/insurance/policy
export async function policyList(params: API.PolicyListParams) {
  return request<API.PolicyListResult>('/api/insurance/policy', {
    method: 'GET',
    params: {
      ...params,
    },
  });
}
