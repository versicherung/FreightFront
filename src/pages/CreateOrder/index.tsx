import React, { useState } from 'react';
import { Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import Steps from './components/Steps';
import StepResult from './components/StepResult';

const CreateOrder: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isFinish, setIsFinish] = useState(false);

  return (
    <PageContainer content="创建一个保险单">
      <Card bordered={false}>
        {isFinish === false ? (
          <Steps current={current} setCurrent={setCurrent} setIsFinish={setIsFinish} />
        ) : (
          <StepResult
            onFinish={() => {
              setCurrent(0);
              setIsFinish(false);
            }}
          />
        )}
      </Card>
    </PageContainer>
  );
};

export default CreateOrder;
