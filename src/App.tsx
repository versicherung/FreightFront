import { history, Link } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { RunTimeLayoutConfig, RequestConfig } from 'umi';
import type { RequestInterceptor, ResponseInterceptor } from 'umi-request';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { stringify } from 'querystring';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { getCurrentUser } from './utils/storage';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.LoginResultData;
  getUserInfo?: () => API.LoginResultData | undefined;
}> {
  const getUserInfo = () => {
    const res = getCurrentUser();
    if (!res) {
      history.push(loginPath);
      return undefined;
    }

    return res;
  };

  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = getUserInfo();

    return {
      getUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    getUserInfo,
    settings: {},
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    links: isDev
      ? [
          <Link to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const AuthHeaderInterceptor: RequestInterceptor = (url, options) => {
  const res = getCurrentUser();
  const authHeader = { Authorization: `insurance ${res?.token}` };

  return {
    url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

const TokenExpireInterceptor: ResponseInterceptor = (res) => {
  if (res.status === 401 || res.status === 403) {
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
  }

  return res;
};

export const request: RequestConfig = {
  errorConfig: {
    adaptor: (resData) => {
      const res = {
        success: true,
        errorCode: '1001',
        errorMessage: 'error message',
      };

      if (resData.code !== 0) {
        res.success = false;
        res.errorCode = String(resData.code);
        res.errorMessage = resData.msg;
      }

      return {
        ...res,
        data: resData.data,
      };
    },
  },
  requestInterceptors: [AuthHeaderInterceptor],
  responseInterceptors: [TokenExpireInterceptor],
};
