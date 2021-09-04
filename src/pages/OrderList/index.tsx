import React, { useState, useRef } from 'react';
import { useRequest, useModel } from 'umi';
import { Button, Dropdown, Menu, message } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { EllipsisOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type { MenuClickEventHandler } from 'rc-menu/lib/interface';

import {
  order,
  exportExcel,
  exportEvidence,
  exportPolicy,
  orderDetail,
  exportOverPolicy,
} from '@/services/api';

import DetailDraw from './components/DetailDraw';

const handleExportExcel = async (
  formRef: React.MutableRefObject<ProFormInstance | undefined>,
  id?: number[],
) => {
  const params: { startTime?: string; endTime?: string; id?: number[] } = {};
  const hide = message.loading('正在导出');

  // 为导出接口添加参数
  if (formRef.current) {
    const fields = formRef.current.getFieldsValue();
    if (fields.startTime) {
      params.startTime = fields.startTime[0].format('YYYY-MM-DD');
      params.endTime = fields.startTime[1].format('YYYY-MM-DD');
    }
  }
  if (id) {
    params.id = [...id];
  }

  try {
    const res = await exportExcel(params);
    hide();

    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.xlsx');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    hide();
    message.error('导出文件失败，请稍后重试');
  }
};

const handleExportEvidence = async (ids: number[]) => {
  const hide = message.loading('正在导出');

  try {
    const res = await exportEvidence({ ids });
    hide();

    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.zip');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    hide();
    message.error('导出文件失败，请稍后重试');
  }
};

const handleExportPolicy = async (ids: number[]) => {
  const hide = message.loading('正在导出');

  try {
    const res = await exportPolicy({ ids });
    hide();

    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.zip');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    hide();
    message.error('导出文件失败，请稍后重试');
  }
};

const handleExportOverPolicy = async (ids: number[], downloadType: number) => {
  const hide = message.loading('正在导出');

  try {
    const res = await exportOverPolicy({ ids, downloadType });
    hide();

    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.zip');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    hide();
    message.error('导出文件失败，请稍后重试');
  }
};

const DropDownMenu: React.FC<{ ids: number[]; policy: boolean; overPolicy: boolean }> = ({
  ids,
  policy,
  overPolicy,
}) => {
  const handleMenuClick: MenuClickEventHandler = ({ key }) => {
    if (key === 'downloadInsurance') {
      handleExportPolicy(ids);
      return;
    }

    if (key === 'downloadOverInsuranceWithPng') {
      handleExportOverPolicy(ids, 0);
      return;
    }

    if (key === 'downloadOverInsuranceWithPDF') {
      handleExportOverPolicy(ids, 1);
      return;
    }

    if (key === 'downloadOverInsuranceWithAll') {
      handleExportOverPolicy(ids, 2);
    }
  };

  return (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="downloadInsurance" disabled={!policy}>
        下载出保单
      </Menu.Item>
      <Menu.SubMenu title="下载投保单" disabled={!overPolicy}>
        <Menu.Item key="downloadOverInsuranceWithPng">仅图片</Menu.Item>
        <Menu.Item key="downloadOverInsuranceWithPDF">仅PDF</Menu.Item>
        <Menu.Item key="downloadOverInsuranceWithAll">全部材料</Menu.Item>
      </Menu.SubMenu>
    </Menu>
  );
};

const TableList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [selectedRowsState, setSelectedRows] = useState<API.OrderListItem[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const {
    data: detailData,
    loading: detailLoading,
    run,
  } = useRequest(orderDetail, { manual: true });
  const { initialState } = useModel('@@initialState');

  const columns: ProColumns<API.OrderListItem>[] = [
    {
      title: '车主',
      dataIndex: 'owner',
      hideInSearch: true,
      render: (dom, record) => {
        return (
          <a
            onClick={() => {
              // setCurrentRow(entity);
              run({ id: record.id });
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '车牌号',
      dataIndex: 'licensePlate',
      hideInSearch: true,
    },
    {
      title: '起保时间',
      dataIndex: 'startTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'startTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '创建人',
      dataIndex: 'username',
      hideInTable: initialState?.currentUser?.role === 4,
      search: false,
    },
    {
      title: '车型',
      dataIndex: 'carType',
      search: false,
    },
    {
      title: '付费方式',
      dataIndex: 'payType',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="downloadFile"
          onClick={() => {
            handleExportEvidence([record.id]);
          }}
        >
          下载证明材料
        </a>,
        <Dropdown
          overlay={
            <DropDownMenu
              ids={[record.id]}
              policy={typeof record.policy === 'string'}
              overPolicy={typeof record.overPolicy === 'string'}
            />
          }
        >
          <a
            key="moreAction"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <EllipsisOutlined />
          </a>
        </Dropdown>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.OrderListItem, API.PageParams>
        headerTitle={'顶单列表'}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          // <Button
          //   type="primary"
          //   key="primary"
          //   onClick={() => {
          //     history.push('/order/create');
          //   }}
          // >
          //   <PlusOutlined /> 新建
          // </Button>,
          <Button key="out" type="primary" onClick={() => handleExportExcel(formRef)}>
            导出承保信息
          </Button>,
        ]}
        request={async (params) => {
          const res = await order(params);

          return {
            success: true,
            data: res.data?.items,
            total: res.data?.total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择&nbsp;
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>
              &nbsp;项
            </div>
          }
        >
          <Button
            type="primary"
            onClick={async () => {
              await handleExportExcel(
                formRef,
                selectedRowsState.map((item) => item.id),
              );
              setSelectedRows([]);
              actionRef.current?.clearSelected?.();
            }}
          >
            导出承保信息
          </Button>

          <Button
            onClick={async () => {
              await handleExportEvidence(selectedRowsState.map((item) => item.id));
              setSelectedRows([]);
              actionRef.current?.clearSelected?.();
            }}
          >
            导出证明材料
          </Button>

          <Button
            onClick={async () => {
              await handleExportPolicy(selectedRowsState.map((item) => item.id));
              setSelectedRows([]);
              actionRef.current?.clearSelected?.();
            }}
          >
            导出出保单
          </Button>

          <Button
            onClick={async () => {
              await handleExportOverPolicy(
                selectedRowsState.map((item) => item.id),
                0,
              );
              setSelectedRows([]);
              actionRef.current?.clearSelected?.();
            }}
          >
            导出投保单（图片版）
          </Button>
        </FooterToolbar>
      )}

      <DetailDraw
        showDetail={showDetail}
        setShowDetail={setShowDetail}
        detailData={detailData}
        detailLoading={detailLoading}
      />
    </PageContainer>
  );
};

export default TableList;
