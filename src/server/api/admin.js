import { clearEmpty, queryApi } from '@/utils';
import axios from '../index';

const AdminApi = {

  /* --------------------------账号管理----------------------*/
  // 添加账号
  addAccount: (params) => axios.post('/api/admin/account/addAccount', params),

  // 删除账号 && 重置密码
  delUserAndResetPwd: (params, sign) => {
    const url = sign === 'del' ? 'deleteAccount' : 'resetPassword';
    return axios.post(`/api/admin/account/${url}`, params);
  },

  // 账号列表
  getAccountList: (params) => axios.get(`/api/admin/account/list?${queryApi(params)}`),

  /* --------------------------顶级机构分配----------------------*/
  // 批量分配-重新分配
  distribute: (params) => axios.post('/api/admin/distribution/distribute', params),

  // 待分配顶级机构数量
  getNum: () => axios.get('/api/admin/distribution/getNum'),

  // 顶级机构分配列表
  distributeList: (type, params) => axios.post(`/api/admin/distribution/list/${type}`, clearEmpty(params)),

  // 负责人列表
  simpleUserList: () => axios.get('/api/admin/distribution/simpleUserList'),

  /* --------------------------客户管理----------------------*/
  // 创建域名机构
  addDomain: (params) => axios.post('/api/admin/organization/addDomain', params),

  // 导出  responseType: "blob" 这个属性得加
  orgExport: (params) => axios.post('/api/admin/organization/export', clearEmpty(params), { responseType: 'blob' }),

  // 详情-顶级合作机构详情页
  orgDetail: (id) => axios.get(`/api/admin/organization/detail?id=${id}`),

  // 详情-创建本级账号
  detailAddOrgUser: (params) => axios.post('/api/admin/organization/detail/addOrgUser', params),

  // 详情-创建子机构
  detailAddSubOrg: (params) => axios.post('/api/admin/organization/detail/addSubOrg', params),

  // 详情-客户使用机构名称修改
  detailEditName: (params) => axios.post('/api/admin/organization/detail/changeName', params),

  // 详情-编辑本级账号
  detailEditOrgUser: (params) => axios.post('/api/admin/organization/detail/changeOrgUser', params),

  // 详情-编辑子机构
  detailChangeSubOrg: (params) => axios.post('/api/admin/organization/detail/changeSubOrg', params),

  // 详情-删除本级账号
  detailDelOrgUser: (params) => axios.post('/api/admin/organization/detail/deleteOrgUser', params),

  // 详情-删除子机构
  detailDelSubOrg: (params) => axios.post('/api/admin/organization/detail/deleteSubOrg', params),

  // 详情-机构用户操作记录
  detailOrgUserLog: (params) => axios.post('/api/admin/organization/detail/orgUserLog', clearEmpty(params)),

  // 详情-重置密码
  detailResetPwd: (params) => axios.post('/api/admin/organization/detail/resetPassword', params),

  // 详情-本级账号-角色查询
  getSimpleListRole: () => axios.get('/api/admin/organization/detail/simpleListRole'),

  // 详情-客户使用机构详情
  detailSubOrg: (id) => axios.get(`/api/admin/organization/detail/subOrg?id=${id}`),

  // 域名机构列表
  orgListDomain: () => axios.get('/api/admin/organization/listDomain'),
  // 置顶
  setToTop: (id) => axios.get(`/api/admin/organization/order?id=${id}`),
  // 取消置顶
  resetToTop: (id) => axios.get(`/api/admin/organization/cancelOrder?id=${id}`),

  // 操作日志
  orgListOrgLog: (params) => axios.post('/api/admin/organization/listOrgLog', clearEmpty(params)),

  // 操作日志-操作人列表
  operatorList: () => axios.get('/api/admin/organization/operatorList'),

  // 机构权限查询
  orgPermission: (id) => axios.get(`/api/admin/organization/permission?id=${id}`),
  // 全量权限查询
  getAllPermission: () => axios.get('/api/admin/organization/getAllPermission'),
  // 创建顶级合作机构 && 权限修改保存
  addAndEditRules: (params, sign) => {
    const url = sign === 'add' ? 'addTopOrg' : 'savePermission';
    return axios.post(`/api/admin/organization/${url}`, clearEmpty(params));
  },
  // 搜索
  searchOrg: (params) => axios.post('/api/admin/organization/searchOrg', clearEmpty(params)),

  // 可选的上级机构列表
  selectParentOrgList: (id) => axios.get(`/api/admin/organization/selectParentOrg?id=${id}`),

  // 机构名称模糊查询
  simpleListOrg: (key) => axios.get(`/api/admin/organization/simpleListOrg?key=${key}`),

  // 账号模糊搜索
  simpleUser: (params) => axios.get(`/api/admin/organization/detail/simpleListUser?${queryApi(params)}`),

  // 账号搜索
  searchUser: (key) => axios.get(`/api/admin/organization/detail/searchUser?id=${key}`),
};

export default AdminApi;
