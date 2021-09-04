import { request } from 'umi';
import OSS from 'ali-oss';

// 获取 STS token GET /api/aliyun/sts
function getSTSToken() {
  return request<API.AliyunSTSResult>('/api/aliyun/sts', { method: 'GET' });
}

const token = await getSTSToken();

const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: token.data?.accessKey as string,
  accessKeySecret: token.data?.accessKeySecret as string,
  stsToken: token.data?.securityToken as string,
  bucket: 'versicherung',
  refreshSTSToken: async () => {
    const { data } = await getSTSToken();
    return {
      accessKeyId: data?.accessKey as string,
      accessKeySecret: data?.accessKeySecret as string,
      stsToken: data?.securityToken as string,
    };
  },
});

export default client;
