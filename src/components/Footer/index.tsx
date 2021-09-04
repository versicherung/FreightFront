import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const defaultMessage = '蚂蚁集团体验技术部出品';
  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '车险出单系统',
          title: '车险出单系统',
          href: '',
          blankTarget: false,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: '',
          blankTarget: false,
        },
        {
          key: '由 Ant Design 驱动',
          title: '由 Ant Design 驱动',
          href: '',
          blankTarget: false,
        },
      ]}
    />
  );
};
