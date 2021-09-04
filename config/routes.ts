export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  {
    name: '订单',
    icon: 'table',
    path: '/order',
    routes: [
      {
        name: '订单列表',
        path: '/order/list',
        component: './OrderList',
      },
      {
        name: '创建订单',
        path: '/order/create',
        component: './CreateOrder',
        access: 'canNormal',
      },
      { component: './404' },
    ],
  },
  {
    name: '保单上传',
    icon: 'cloud-upload',
    path: '/uploadPolicy',
    component: './uploadPolicy',
    access: 'canAdminAndInsurance',
  },
  {
    name: '用户管理',
    icon: 'user',
    path: '/userManage',
    component: './user/List',
    access: 'canAdmin',
  },
  { path: '/', redirect: '/order/list' },
  { component: './404' },
];
