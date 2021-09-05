import React, { useCallback, useState, useRef } from 'react';
import { Avatar, Menu, Spin, message } from 'antd';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import md5 from 'md5';

import type { MenuInfo } from 'rc-menu/lib/interface';
import type { FormInstance } from '@ant-design/pro-form';
import HeaderDropdown from '../HeaderDropdown';
import { updateOwnPassword } from '@/services/api';
import { clearCurrentUser } from '@/utils/storage';
// import { outLogin } from '@/services/api';

import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  clearCurrentUser();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const handleUpdatePassword = async (password: string) => {
  const hide = message.loading('正在修改密码', 0);

  try {
    await updateOwnPassword({ newPassword: md5(password) });
    hide();
    message.success('修改密码成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改密码失败，请重试');
    return false;
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const formRef = useRef<FormInstance>();
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      }

      if (key === 'changePasswd') {
        formRef.current?.resetFields();
        setModalVisible(true);
        return;
      }

      history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.username) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="changePasswd">
        <UserOutlined />
        修改密码
      </Menu.Item>

      <Menu.Divider />

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src="https://pic4.zhimg.com/v2-9e2ce9939b2dbc8084ce05e473aa875b_r.jpg?source=1940ef5c"
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>{currentUser.username}</span>
        </span>
      </HeaderDropdown>

      <ModalForm
        title="新建用户"
        width="400px"
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        formRef={formRef}
        onFinish={async (value: any) => {
          const success = await handleUpdatePassword(value.password);
          if (success) {
            setInitialState((s) => ({ ...s, currentUser: undefined }));
            loginOut();
            setModalVisible(false);
          }
        }}
      >
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
      </ModalForm>
    </>
  );
};

export default AvatarDropdown;
