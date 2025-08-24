// Bu dosya, uygulamanın API kök adresini ve kullanılacak endpoint'leri tanımlar.
export const API_HOST = 'https://40368fbe-667d-4d7d-b6f6-4bea2bc79a27.mock.pstmn.io';  //mock api kök adresi
export const API_ENDPOINTS = {
  tickets: `${API_HOST}/api/tickets`,  //ticket islemleri için endpoint
} as const;
