import { request } from 'umi';

export function idCardOcr(url: string) {
  return request<API.IdCardOcrResult>('/api/ocr/idCard', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}

export function businessOcr(url: string) {
  return request<API.BusinessOcrResult>('/api/ocr/business', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}

export function drivingOcr(url: string) {
  return request<API.DrivingOcrResult>('/api/ocr/driving', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}

export function certificateOcr(url: string) {
  return request<API.CertificateOcrResult>('/api/ocr/certificate', {
    method: 'POST',
    data: {
      imgUrl: url,
    },
  });
}
