import React, { useState, useRef } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import md5 from 'md5';
import type { FormInstance } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import { addUser, userList, deleteUser, updateUser } from '@/services/api';

const handleAdd = async (fields: API.AddUserParams) => {
  const hide = message.loading('正在添加', 0);

  try {
    await addUser({ ...fields, password: md5(fields.password) });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败，请重试');
    return false;
  }
};

const handleDelete = async (fields: API.DeleteUserParams) => {
  const hide = message.loading('正在删除', 0);

  try {
    await deleteUser({ ...fields });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const handleUpdate = async (fields: API.UpdateUserParams) => {
  const hide = message.loading('正在更新', 0);

  try {
    await updateUser({
      ...fields,
      password: fields.password && fields.password !== '' ? md5(fields.password) : undefined,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败，请重试');
    return false;
  }
};

const UserList: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const createFormRef = useRef<FormInstance>();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(0);
  const updateFormRef = useRef<FormInstance>();
  const actionTypeRef = useRef<ActionType>();

  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      hideInSearch: true,
      valueEnum: {
        1: {
          text: 'root 用户',
          status: 'Default',
        },
        2: {
          text: '管理员',
          status: 'Error',
        },
        4: {
          text: '保险公司',
          status: 'Success',
        },
        8: {
          text: '业务员',
          status: 'Default',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="updateUser"
          onClick={() => {
            const roleMap = {
              1: 1,
              2: 2,
              4: 3,
              8: 4,
            };
            setUpdateUserId(record.id);
            updateFormRef.current?.resetFields();
            updateFormRef.current?.setFieldsValue({ roleId: roleMap[record.role] });
            setUpdateModalVisible(true);
          }}
        >
          修改
        </a>,
        <a
          key="deleteUser"
          onClick={async () => {
            const success = await handleDelete({ id: record.id });
            if (success) {
              actionTypeRef.current?.reload();
            }
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.UserListItem, API.UserListParams>
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        actionRef={actionTypeRef}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              createFormRef.current?.resetFields();
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建用户
          </Button>,
        ]}
        request={async (params) => {
          const res = await userList(params);

          return {
            success: true,
            data: res.data?.items,
            total: res.data?.total,
          };
        }}
      />
      <ModalForm
        title="新建用户"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        formRef={createFormRef}
        onFinish={async (value: any) => {
          const success = await handleAdd(value);
          if (success) {
            setCreateModalVisible(false);

            if (actionTypeRef.current) {
              actionTypeRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          label="用户名"
          width="md"
          name="username"
          hasFeedback
          placeholder="请输入用户名"
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        />
        <ProFormText.Password
          label="密码"
          width="md"
          name="password"
          hasFeedback
          placeholder="请输入密码"
          rules={[
            {
              required: true,
              message: '请输入密码',
            },
          ]}
        />
        <ProFormText.Password
          label="确认密码"
          width="md"
          name="secondPassword"
          hasFeedback
          placeholder="请确认密码"
          rules={[
            {
              required: true,
              message: '请确认密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        />
        <ProFormSelect
          label="用户角色"
          width="md"
          name="roleId"
          hasFeedback
          placeholder="请选择用户角色"
          rules={[
            {
              required: true,
              message: '请选择用户角色',
            },
          ]}
          request={async () => {
            return [
              { label: '管理员', value: 2 },
              { label: '保险公司', value: 3 },
              { label: '业务员', value: 4 },
            ];
          }}
        />
      </ModalForm>

      <ModalForm
        title="修改用户信息"
        width="400px"
        visible={updateModalVisible}
        onVisibleChange={setUpdateModalVisible}
        formRef={updateFormRef}
        onFinish={async (value: any) => {
          const success = await handleUpdate({ ...value, id: updateUserId });
          if (success) {
            setUpdateModalVisible(false);

            if (actionTypeRef.current) {
              actionTypeRef.current.reload();
            }
          }
        }}
      >
        <ProFormText.Password
          label="密码"
          width="md"
          name="password"
          hasFeedback
          placeholder="请输入密码"
        />
        <ProFormText.Password
          label="确认密码"
          width="md"
          name="secondPassword"
          hasFeedback
          placeholder="请确认密码"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次输入的密码不一致'));
              },
            }),
          ]}
        />
        <ProFormSelect
          label="用户角色"
          width="md"
          name="roleId"
          hasFeedback
          placeholder="请选择用户角色"
          rules={[
            {
              required: true,
              message: '请选择用户角色',
            },
          ]}
          request={async () => {
            return [
              { label: '管理员', value: 2 },
              { label: '保险公司', value: 3 },
              { label: '业务员', value: 4 },
            ];
          }}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default UserList;
