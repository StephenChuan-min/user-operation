import axios from '../index';

const monitorApi = {
  detail: (id) => axios.get(`/api/monitor/detail?id=${id}`),
  getList: (params) => axios.post('/api/monitor/list', params),
  nums: () => axios.get('/api/monitor/nums'),
  save: (params) => axios.post('/api/monitor/save', params),
};
export default monitorApi;
