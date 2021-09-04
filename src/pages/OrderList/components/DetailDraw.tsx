import React from 'react';
import { Drawer, Row, Col, Spin, Image, Divider } from 'antd';

import './DetailDraw.less';

const DescriptionItem: React.FC<{ title: string; content: string | JSX.Element }> = ({
  title,
  content,
}) => (
  <div className="site-description-item-profile-wrapper">
    <p className="site-description-item-profile-p-label">{title}:</p>
    {content}
  </div>
);

const DetailDraw: React.FC<{
  detailLoading: boolean;
  showDetail: boolean;
  setShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
  detailData: API.OrderDetailData | undefined;
}> = ({ showDetail, setShowDetail, detailLoading, detailData }) => {
  return (
    <Drawer visible={showDetail} closable={false} onClose={() => setShowDetail(false)} width={640}>
      {detailLoading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Spin />
        </div>
      )}
      {detailData && (
        <>
          <p className="site-description-item-profile-p" style={{ marginBottom: 24 }}>
            订单详情
          </p>
          <p className="site-description-item-profile-p">基本信息</p>
          <Row>
            <Col span={12}>
              <DescriptionItem title="车主" content={detailData.owner} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="车牌号" content={detailData.licensePlate} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="起保时间" content={detailData.startTime} />
            </Col>
            <Col span={12}>
              <DescriptionItem title="车型" content={detailData.carType} />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="付费方式" content={detailData.payType} />
            </Col>
          </Row>

          <Divider />

          {detailData.idCard && (
            <>
              <p className="site-description-item-profile-p">身份证信息</p>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="身份号码" content={detailData.idCard.number} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="地址" content={detailData.idCard.address} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="照片"
                    content={<Image height={200} src={detailData.idCard.url} />}
                  />
                </Col>
              </Row>
            </>
          )}

          {detailData.business && (
            <>
              <p className="site-description-item-profile-p">营业执照信息</p>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="身份号码" content={detailData.business.number} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="地址" content={detailData.business.address} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="照片"
                    content={<Image height={200} src={detailData.business.url} />}
                  />
                </Col>
              </Row>
            </>
          )}

          <Divider />

          {detailData.driving && (
            <>
              <p className="site-description-item-profile-p">行驶证信息</p>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="车架号" content={detailData.driving.frame} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="发动机号" content={detailData.driving.engine} />
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="车辆类型" content={detailData.driving.type} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="照片"
                    content={<Image height={200} src={detailData.driving.url} />}
                  />
                </Col>
              </Row>
            </>
          )}

          {detailData.certificate && (
            <>
              <p className="site-description-item-profile-p">车辆合格证信息</p>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="车架号" content={detailData.certificate.frame} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="发动机号" content={detailData.certificate.engine} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="照片"
                    content={<Image height={200} src={detailData.certificate.url} />}
                  />
                </Col>
              </Row>
            </>
          )}

          <Divider />

          {detailData.policy && (
            <>
              <p className="site-description-item-profile-p">出保单信息</p>
              <Row>
                <Col span={12}>
                  <DescriptionItem title="保单名称" content={detailData.policy.name} />
                </Col>
                <Col span={12}>
                  <DescriptionItem title="保单号" content={detailData.policy.number} />
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <DescriptionItem
                    title="保单下载"
                    content={
                      <a href={detailData.policy.url} target="_blank">
                        打开
                      </a>
                    }
                  />
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </Drawer>
  );
};

export default DetailDraw;
