import { clearEmpty, queryApi } from '@/utils';
import axios from '../index';

const CommonApi = {
  // 文书搜索
  documentSearch: (params = {}) => axios.get(`/api/user/judgment/search?${queryApi(params)}`),

  wenshuDetail: (id, wid, params) => axios.post(`/api/user/judgment/detail/${id}/${wid}`, clearEmpty(params)),

  htmlDetailInfo: (id) => axios.get(`/api/asset/auction/${id}/htmlDetailInfo`),

  // 审核管理
  listTopOrg: () => axios.get('/api/user/audit/listTopOrg'),

  // 审核列表信息
  getAuditList: (params) => axios.post('/api/user/audit/getAuditList', clearEmpty(params)),

  // 客户未读-召回数量
  auditCountNum: (params) => axios.post('/api/user/audit/countNum', clearEmpty(params)),

  // 退回-再次退回
  auditBack: (params) => axios.post('/api/user/audit/back', clearEmpty(params)),

  auditAction: (sign, params) => {
    let url;
    if (sign === 'reCall') {
      url = '/api/user/audit/reCall';
    } else {
      url = '/api/user/audit/pushOrNot';
    }
    return axios.post(url, clearEmpty(params));
  },

  // 结构化校验
  assetDetail: (auctionId) => axios.get(`/api/user/audit/assetDetail?auctionId=${auctionId}`),

  // 结构化校验  确认
  confirm: (id) => axios.get(`/api/user/audit/confirm?auctionId=${id}`),
};

export default CommonApi;
