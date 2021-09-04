import React from 'react';
import { history } from 'umi';
import { Result, Button } from 'antd';

const StepResult: React.FC<{ onFinish: () => void }> = (props) => {
  return (
    <Result
      status="success"
      title="操作成功"
      subTitle="可以到订单列表中查看"
      extra={
        <>
          <Button type="primary" onClick={props.onFinish}>
            接着创建
          </Button>
          <Button
            onClick={() => {
              history.push('/order/list');
            }}
          >
            查看订单
          </Button>
        </>
      }
    />
  );
};

export default StepResult;
