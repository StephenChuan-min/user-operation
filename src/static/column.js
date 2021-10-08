// 账号管理列表
const accountManagementColumn = [
  {
    prop: 'id',
    label: 'ID',
    width: '17.3%',
    sort: false,
    align: 'left',
    class: 'id',
  },
  {
    prop: 'phone',
    label: '账号',
    width: '15.8%',
    sort: false,
    align: 'left',
    class: 'phone',
  },
  {
    prop: 'name',
    label: '姓名',
    width: '11.6%',
    sort: false,
    align: 'left',
    class: 'name',
  },
  {
    prop: 'orgNum',
    label: '负责顶级机构数',
    width: '16.1%',
    sort: 'custom',
    align: 'center',
    class: 'org-num',
  },
  {
    prop: 'obligorNum',
    label: '债务人数',
    width: '19.7%',
    sort: 'custom',
    align: 'center',
    class: 'obligor-num',
  },
];

// 顶级机构分配列表
const taskAssignColumn = [
  {
    prop: 'id',
    label: 'ID',
    sort: false,
    align: 'left',
    class: 'id',
  },
  {
    prop: 'orgName',
    label: '顶级合作机构名称',
    sort: false,
    align: 'left',
    class: 'org-name',
  },
  {
    prop: 'type',
    label: '机构类型',
    sort: false,
    align: 'left',
    class: 'type',
  },
  {
    prop: 'orgNum',
    label: '客户使用机构数',
    sort: 'custom',
    align: 'center',
    class: 'org-num',
  },
  {
    prop: 'obligorNum',
    label: '债务人数',
    sort: 'custom',
    align: 'center',
    class: 'obligor-num',
  },
];

// 客户管理列表
const customerColumn = [
  {
    prop: 'id',
    label: 'ID',
    sort: false,
    width: '7%',
  },
  {
    prop: 'name',
    label: '顶级合作机构名称',
    width: '25%',
    sort: false,
  },
  {
    prop: 'typeName',
    label: '机构类型',
    sort: false,
    width: '7%',
  },
  {
    prop: 'subOrgNum',
    label: '全部子机构数',
    width: '10%',
    align: 'center',
    sort: false,
  },
  {
    prop: 'accountNum',
    label: '总账号数',
    align: 'center',
    width: '8%',
    sort: false,
  },
  {
    prop: 'startTime',
    label: '合同开始日期',
    sort: 'custom',
    width: '12%',
  },
  {
    prop: 'endTime',
    label: '合同结束日期',
    sort: 'custom',
    width: '12%',
  },
];

// 操作日志列表
const operationColumn = [
  {
    prop: 'time',
    label: '操作时间',
    width: '271',
    class: 'time',
  },
  {
    prop: 'operator',
    label: '操作人',
    width: '186',
    class: 'operator',
  },
  {
    prop: 'title',
    label: '操作模块',
    width: '227',
    class: 'title',
  },
];

// 角色信息列表
const roleInfoColumn = [
  {
    prop: 'name',
    label: '名称',
    width: '19%',
    class: 'name',
  },
  {
    prop: 'labelType',
    label: '角色',
    width: '14.1%',
    class: 'label-type',
  },
  {
    prop: 'number',
    label: '证件号',
    width: '21.1%',
    class: 'number',
  },
  {
    prop: 'birthday',
    label: '生日',
    width: '14.7%',
    class: 'birthday',
  },
  {
    prop: 'gender',
    label: '性别',
    width: '14.8%',
    class: 'gender',
  },
  {
    prop: 'notes',
    label: '备注',
    width: '17.1%',
    class: 'notes',
  },
];

// 我的机构列表
const myOrgColumn = [
  {
    prop: 'name',
    label: '顶级合作机构名称',
    sort: false,
    width: '20%',
  },
  {
    prop: 'subOrgNum',
    label: '全部子机构数',
    align: 'center',
    sort: false,
    width: '10%',
  },
  {
    prop: 'obligorNum',
    label: '总债务人数',
    align: 'center',
    sort: false,
    width: '12%',
  },
  {
    prop: 'start',
    label: '合同开始日期',
    sort: 'custom',
    width: '12%',
  },
  {
    prop: 'end',
    label: '合同结束日期',
    sort: 'custom',
    width: '10%',
  },
  {
    prop: 'pushNum',
    label: '昨日推送量',
    align: 'center',
    sort: 'custom',
    width: '9%',
  },
  {
    prop: 'readRate',
    label: '上周客户查看率',
    align: 'center',
    sort: 'custom',
    width: '10%',
  },
];

// 我的机构列表
const auditColumn = [
  {
    prop: 'assetInfo',
    label: '资产信息 (更新时间)',
    sort: 'custom',
    width: '22%',
  },
  {
    prop: 'remarkInfo',
    label: '匹配备注信息',
    sort: false,
    width: '31.3%',
  },
  {
    prop: 'auctionInfo',
    label: '拍卖信息 (开拍时间)',
    sort: 'custom',
    width: '34.1%',
  },
  {
    prop: 'status',
    label: '状态',
    sort: false,
    width: '6%',
  },
];

// api监控列表
const monitorApiColumn = [
  {
    prop: 'id',
    label: 'ID',
    sort: false,
    width: 80,
  },
  {
    prop: 'orgName',
    label: '合作机构名称',
    sort: false,
  },
  {
    prop: 'domain',
    label: '域名名称',
    sort: false,
  },
  {
    prop: 'debtors',
    label: '总债务人数',
    sort: false,
    align: 'center',
  },
  {
    prop: 'useTimes',
    label: '已使用查询次数',
    sort: false,
    align: 'center',
  },
  {
    prop: 'totalTimes',
    label: '全部查询次数',
    sort: false,
    align: 'center',
  },
  {
    prop: 'startDate',
    label: '合同开始日期',
    sort: 'START',
  },
  {
    prop: 'endDate',
    label: '合同结束日期',
    sort: 'EXPIRE',
  },
];
export {
  accountManagementColumn, taskAssignColumn, customerColumn, operationColumn, roleInfoColumn, myOrgColumn, auditColumn, monitorApiColumn,
};
