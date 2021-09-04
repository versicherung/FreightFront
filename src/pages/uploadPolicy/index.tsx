import React from 'react';
import { Card, Divider, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getCurrentUser } from '@/utils/storage';
import { policyList } from '@/services/api';

import type { ProColumns } from '@ant-design/pro-table';

const UploadPolicy: React.FC = () => {
  const columns: ProColumns<API.PolicyListItem>[] = [
    {
      title: '文件名称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '处理状态',
      dataIndex: 'processType',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '初始化操作',
          status: 'Default',
        },
        1: {
          text: '正在上传OSS',
          status: 'Processing',
        },
        2: {
          text: '正在进行OCR识别',
          status: 'Processing',
        },
        3: {
          text: '正在生成投保单',
          status: 'Processing',
        },
        4: {
          text: '操作成功',
          status: 'Success',
        },
        5: {
          text: '操作失败，请手动重试',
          status: 'Error',
        },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="download"
          href={record.url}
          target="_blank"
          style={{
            pointerEvents: record.url ? 'auto' : 'none',
            opacity: record.url ? 1 : 0.2,
          }}
        >
          下载保单
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Card>
        <Upload
          accept=".pdf,.zip"
          maxCount={1}
          name="file"
          action="/api/ocr/policy"
          headers={{ Authorization: `insurance ${getCurrentUser()?.token}` }}
        >
          <Button>
            <UploadOutlined />
            上传
          </Button>
        </Upload>
      </Card>
      <Divider />
      <ProTable
        search={false}
        rowKey="id"
        polling={1}
        columns={columns}
        request={async (params) => {
          const res = await policyList(params);

          return {
            success: true,
            data: res.data?.items,
            total: res.data?.total,
          };
        }}
      />
    </PageContainer>
  );
};

export default UploadPolicy;
