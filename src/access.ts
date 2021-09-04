/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.LoginResultData | undefined }) {
  const { currentUser } = initialState || {};
  return {
    canRoot: currentUser && currentUser.role === 1,
    canAdmin: currentUser && (currentUser.role === 1 || currentUser.role === 2),
    canAdminAndInsurance:
      currentUser && (currentUser.role === 1 || currentUser.role === 2 || currentUser.role === 4),
    canInsurance: currentUser && currentUser.role === 4,
    canNormal: currentUser && (currentUser.role === 1 || currentUser.role === 8),
  };
}
