import request from './index';

import type { CustomerListResponse } from '@/types/customers';

export const fetchTableData = (params: { id?: number | string }) => {
  return request<CustomerListResponse>({
    url: '/customers/list',
    method: 'get',
    params
  })
}