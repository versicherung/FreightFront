import React, { useState, useRef } from 'react';
import { message } from 'antd';
import { StepsForm, ProFormSelect, ProFormDatePicker, ProFormText } from '@ant-design/pro-form';
import moment from 'moment';

import type { FormInstance } from 'antd';
import { businessOcr, certificateOcr, drivingOcr, idCardOcr } from '@/services/ocr';
import { createOrder } from '@/services/api';
import UploadAliyunOSS from './UploadAliyunOSS';

const handleOCR = async (callback: () => Promise<void>, failCallback: () => void) => {
  const hide = message.loading('正在进行OCR识别');

  try {
    await callback();
    message.info('识别成功');
    hide();
  } catch (e) {
    hide();
    message.error('识别失败');
    failCallback();
  }
};

const Steps: React.FC<{
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setIsFinish: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ current, setCurrent, setIsFinish }) => {
  const [fileIds, setFileIds] = useState({
    idCardId: 0,
    businessId: 0,
    drivingId: 0,
    certificateId: 0,
  });

  const [isIdCard, setIsIdCard] = useState(true);
  const secondRef = useRef<FormInstance>();
  const idCardRef = useRef<any>();
  const businessRef = useRef<any>();
  const [isSecondAfterOcr, setIsSecondAfterOcr] = useState(false);

  const [isDriving, setIsDriving] = useState(true);
  const thirdRef = useRef<FormInstance>();
  const drivingRef = useRef<any>();
  const certificateRef = useRef<any>();
  const [isThirdAfterOcr, setIsThirdAfterOcr] = useState(false);

  const onFinish = async (value: any) => {
    const data: API.CreateOrderParams = {
      startTime: value.startTime,
      carTypeId: value.carType,
      paymentId: value.payment,
    };

    if (value.idOrBusiness === 'idCard') {
      data.idCard = {
        id: fileIds.idCardId,
        name: value.name,
        number: value.number,
        address: value.address,
      };
    } else {
      data.businessLicense = {
        id: fileIds.businessId,
        name: value.name,
        number: value.number,
        address: value.address,
      };
    }

    if (value.drivingOrCertificate === 'driving') {
      data.drivingLicense = {
        id: fileIds.drivingId,
        plate: value.plate,
        frame: value.frame,
        engine: value.engine,
        type: value.vehicleType,
      };
    } else {
      data.certificate = {
        id: fileIds.certificateId,
        frame: value.frame,
        engine: value.engine,
      };
    }

    const hide = message.loading('正在创建订单');
    try {
      createOrder(data);
      hide();
      message.info('订单创建成功');
      setIsFinish(true);
      return true;
    } catch (e) {
      hide();
      message.error('订单创建失败');
      return false;
    }
  };

  return (
    <StepsForm current={current} onCurrentChange={setCurrent} onFinish={onFinish}>
      <StepsForm.StepForm
        title="选择车辆类型，设置基本信息"
        initialValues={{
          insuranceType: 'newCar',
          startTime: moment(),
          payment: 1,
          carType: 1,
        }}
      >
        <ProFormSelect
          label="投保类型"
          width="md"
          name="insuranceType"
          rules={[{ required: true, message: '请选择投保类型' }]}
          valueEnum={{
            newCar: '新车',
            oldCar: '旧车',
          }}
        />

        <ProFormDatePicker
          label="起保日期"
          width="md"
          name="startTime"
          rules={[{ required: true, message: '请选择起保日期' }]}
        />

        <ProFormSelect
          label="付费方式"
          width="md"
          name="payment"
          rules={[{ required: true, message: '请选择付费方式' }]}
          request={async () => [
            { label: '净费', value: 1 },
            { label: '对公', value: 3 },
          ]}
        />

        <ProFormSelect
          label="车辆类型"
          width="md"
          name="carType"
          rules={[{ required: true, message: '请选择车辆类型' }]}
          request={async () => [
            { label: '普通货车', value: 1 },
            { label: '自卸搅拌', value: 2 },
          ]}
        />
      </StepsForm.StepForm>

      <StepsForm.StepForm
        title="上传身份证或营业执照"
        formRef={secondRef}
        initialValues={{
          idOrBusiness: 'idCard',
        }}
        onValuesChange={({ idOrBusiness }) => {
          if (idOrBusiness) {
            idCardRef.current?.setFileList([]);
            businessRef.current?.setFileList([]);

            secondRef.current?.setFieldsValue({
              name: '',
              number: '',
              address: '',
            });
            setIsSecondAfterOcr(false);
            setIsIdCard(idOrBusiness === 'idCard');
          }
        }}
      >
        <ProFormSelect
          label="证件类型"
          width="md"
          name="idOrBusiness"
          rules={[{ required: true, message: '请选择证件类型' }]}
          valueEnum={{
            idCard: '身份证',
            business: '营业执照',
          }}
        />

        {isIdCard ? (
          <>
            <UploadAliyunOSS
              ref={idCardRef}
              namespace="idCard"
              ocrCallback={async (res) => {
                handleOCR(
                  async () => {
                    const ocrRes = await idCardOcr(res.url);
                    const { data } = ocrRes;
                    secondRef.current?.setFieldsValue({
                      name: data?.name,
                      number: data?.number,
                      address: data?.address,
                    });
                    setIsSecondAfterOcr(true);
                    setFileIds((s) => ({
                      ...s,
                      idCardId: data?.id as number,
                    }));
                  },
                  () => {
                    idCardRef.current.setFileList([]);
                  },
                );
              }}
              onRemove={() => {
                secondRef.current?.setFieldsValue({
                  name: '',
                  number: '',
                  address: '',
                });
                setIsSecondAfterOcr(false);
              }}
            />

            <ProFormText
              name="name"
              label="姓名"
              width="md"
              placeholder="请输入姓名"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="number"
              label="身份证号码"
              width="md"
              placeholder="请输入身份证号码"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="address"
              label="住址"
              width="md"
              placeholder="请输入住址"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />
          </>
        ) : (
          <>
            <UploadAliyunOSS
              ref={businessRef}
              namespace="business"
              ocrCallback={async (res) => {
                handleOCR(
                  async () => {
                    const ocrRes = await businessOcr(res.url);
                    const { data } = ocrRes;
                    secondRef.current?.setFieldsValue({
                      name: data?.name,
                      number: data?.number,
                      address: data?.address,
                    });
                    setIsSecondAfterOcr(true);
                    setFileIds((s) => ({
                      ...s,
                      businessId: data?.id as number,
                    }));
                  },
                  () => {
                    businessRef.current.setFileList([]);
                  },
                );
              }}
              onRemove={() => {
                secondRef.current?.setFieldsValue({
                  name: '',
                  number: '',
                  address: '',
                });
                setIsSecondAfterOcr(false);
              }}
            />

            <ProFormText
              name="name"
              label="企业名称"
              width="md"
              placeholder="请输入企业名称"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="number"
              label="统一信用代码"
              width="md"
              placeholder="请输入统一信用代码"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="address"
              label="地址"
              width="md"
              placeholder="请输入地址"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />
          </>
        )}
      </StepsForm.StepForm>

      <StepsForm.StepForm
        title="上传行驶证或车辆合格证"
        formRef={thirdRef}
        initialValues={{
          drivingOrCertificate: 'driving',
        }}
        onValuesChange={({ drivingOrCertificate }) => {
          if (drivingOrCertificate) {
            if (drivingOrCertificate === 'driving') {
              thirdRef.current?.setFieldsValue({
                plate: '',
                vehicleType: '',
                engine: '',
                frame: '',
              });
            } else {
              thirdRef.current?.setFieldsValue({
                engine: '',
                frame: '',
              });
            }

            drivingRef.current?.setFileList([]);
            certificateRef.current?.setFileList([]);

            setIsThirdAfterOcr(false);
            setIsDriving(drivingOrCertificate === 'driving');
          }
        }}
      >
        <ProFormSelect
          label="证件类型"
          width="md"
          name="drivingOrCertificate"
          rules={[{ required: true, message: '请选择证件类型' }]}
          valueEnum={{
            driving: '行驶证',
            certificate: '车辆合格证',
          }}
        />

        {isDriving ? (
          <>
            <UploadAliyunOSS
              ref={drivingRef}
              namespace="driving"
              ocrCallback={async (res) => {
                handleOCR(
                  async () => {
                    const ocrRes = await drivingOcr(res.url);
                    const { data } = ocrRes;
                    thirdRef.current?.setFieldsValue({
                      plate: data?.plate,
                      vehicleType: data?.type,
                      engine: data?.engine,
                      frame: data?.frame,
                    });
                    setIsThirdAfterOcr(true);
                    setFileIds((s) => ({
                      ...s,
                      drivingId: data?.id as number,
                    }));
                  },
                  () => {
                    drivingRef.current.setFileList([]);
                  },
                );
              }}
              onRemove={() => {
                thirdRef.current?.setFieldsValue({
                  plate: '',
                  vehicleType: '',
                  engine: '',
                  frame: '',
                });

                setIsThirdAfterOcr(false);
              }}
            />

            <ProFormText
              name="plate"
              label="车牌号码"
              width="md"
              placeholder="请输入车牌号码"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="vehicleType"
              label="车辆类型"
              width="md"
              placeholder="请输入车辆类型"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="engine"
              label="发动机号"
              width="md"
              placeholder="请输入发动机号"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="frame"
              label="车架号"
              width="md"
              placeholder="请输入车架号"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />
          </>
        ) : (
          <>
            <UploadAliyunOSS
              ref={certificateRef}
              namespace="certificate"
              ocrCallback={async (res) => {
                handleOCR(
                  async () => {
                    const ocrRes = await certificateOcr(res.url);
                    const { data } = ocrRes;
                    thirdRef.current?.setFieldsValue({
                      engine: data?.engine,
                      frame: data?.frame,
                    });
                    setIsThirdAfterOcr(true);
                    setFileIds((s) => ({
                      ...s,
                      certificateId: data?.id as number,
                    }));
                  },
                  () => {
                    certificateRef.current.setFileList([]);
                  },
                );
              }}
              onRemove={() => {
                thirdRef.current?.setFieldsValue({
                  engine: '',
                  frame: '',
                });
                setIsThirdAfterOcr(false);
              }}
            />

            <ProFormText
              name="engine"
              label="发动机号"
              width="md"
              placeholder="请输入发动机号"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="frame"
              label="车架号"
              width="md"
              placeholder="请输入车架号"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />
          </>
        )}
      </StepsForm.StepForm>

      <StepsForm.StepForm title="上传其他材料">
        <UploadAliyunOSS
          namespace="otherFile"
          ocrCallback={async (res) => {
            // const ocrRes = await businessOcr(res.url);
            // const { data } = ocrRes;
            // secondRef.current?.setFieldsValue({
            //   name: data?.name,
            //   number: data?.number,
            //   address: data?.address,
            // });
            // setIsSecondAfterOcr(true);
            // setFileIds((s) => ({
            //   ...s,
            //   businessId: data?.id as number,
            // }));

            return res;
          }}
          onRemove={() => {}}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default Steps;
