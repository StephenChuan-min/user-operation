import axios from '../index';

const monitorViewApi = {
  getTotalAuctionNum: () => axios.get('/api/admin/monitorView/getTotalAuctionNum'),
  getSyncDiffNum: () => axios.get('/api/admin/monitorView/getSyncDiffNum'),
  getSyncView: (type) => axios.get(`/api/admin/monitorView/getSyncView?type=${type}`),
  getPushView: (type) => axios.get(`/api/admin/monitorView/getPushView?type=${type}`),
  getDataIncrView: (type) => axios.get(`/api/admin/monitorView/getDataIncrView?type=${type}`),
  getPushViewOfDay: (date) => axios.get(`/api/admin/monitorView/getPushViewOfDay?date=${date}`),
  getDataIncrViewOfDay: (date) => axios.get(`/api/admin/monitorView/getDataIncrViewOfDay?date=${date}`),
  getRecallView: () => axios.get('/api/admin/monitorView/getRecallView'),
};
export default monitorViewApi;
