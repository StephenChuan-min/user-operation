// 排序字段&&方式 对应
const SORTER_TYPE = {
  obligorNum: 'OBLIGOR_NUM',
  orgNum: 'ORG_NUM',
  ascending: 'ASC',
  descending: 'DESC',
};

// 顶级机构列表排序
const CUSTOMER_LIST = {
  startTime: 'START',
  endTime: 'END',
  ascending: 'ASC',
  descending: 'DESC',
};

// 我的机构排序
const MYORG_LIST = {
  start: 'START',
  end: 'END',
  pushNum: 'PUSH_NUM',
  readRate: 'READ_RATE',
  ascending: 'ASC',
  descending: 'DESC',
};

// 拍卖状态
const AUCTION_STATUS = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: '即将开始',
  },
  {
    value: '3',
    label: '正在进行',
  },
  {
    value: '5',
    label: '已成交',
  },
  {
    value: '7',
    label: '已流拍',
  },
  {
    value: '9',
    label: '中止',
  },
  {
    value: '11',
    label: '撤回',
  },
];

const DEBTORES_TYPE = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: '企业',
  },
  {
    value: '2',
    label: '个人',
  },
];

const ACTION_TYPE = [
  {
    value: '',
    label: '全部',
  },
  {
    value: '1',
    label: '已推送',
  },
  {
    value: '2',
    label: '不推送',
  },
  {
    value: '3',
    label: '已退回',
  },
  {
    value: '4',
    label: '已修改',
  },
  {
    value: '5',
    label: '已召回',
  },
];

const TOP_ORG_STATUS = {
  0: '全部',
  1: '合作中',
  2: '已过期',
  3: '即将过期（两月内）',
  4: '已过期（两月内）',
};

const COLLATERAL_TYPE = {
  0: '未知',
  1: '有抵押',
  2: '无抵押',
};
const HOUSE_TYPE = {
  0: '未知',
  1: '商用',
  2: '住宅',
  3: '工业',
};
const DOCUMENTFIND_STATUS = {
  0: '未找到文书',
  1: '找到文书',
};

const WSINATTACH_STATUS = {
  0: '否',
  1: '是',
};
// 机构类型
const orgType = [
  {
    label: '全部',
    value: -1,
  },
  {
    label: '正式',
    value: 1,
  },
  {
    label: '试用',
    value: 0,
  },
];

// 操作日志-操作模块
const OPERA_MODULE_LIST = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '创建顶级合作机构',
    value: 1,
  },
  {
    label: '编辑机构名称',
    value: 2,
  },
  {
    label: '修改机构类型',
    value: 3,
  },
  {
    label: '修改合同起止日期',
    value: 4,
  },
  {
    label: '修改上级机构ID',
    value: 5,
  },
  {
    label: '修改画像查询次数',
    value: 6,
  },
  {
    label: '修改分类搜索次数',
    value: 7,
  },
  {
    label: '修改监控债务人数',
    value: 8,
  },
  {
    label: '修改配置子机构数',
    value: 9,
  },
  {
    label: '修改配置账号数',
    value: 10,
  },
  {
    label: '修改资产监控权限',
    value: 11,
  },
];

// 客户详情 -操作记录
const OPERATION_TYPE = {
  0: '全部',
  1: '登录',
  2: '退出登录',
  3: '导入债务人',
  4: '删除业务',
  5: '开启推送',
  6: '关闭推送',
};

const DOCUMENT_DETAIL = [
  {
    label: '审理法院',
    key: 'court',
  },
  {
    label: '案件类型',
    key: 'caseType',
  },
  {
    label: '案由',
    key: 'reason',
  },
  {
    label: '审理程序',
    key: 'trialRound',
  },
  {
    label: '裁判日期',
    key: 'trialDate',
  },
];

// 匹配类型
const IMPORTANT_TYPE = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '精确匹配',
    value: 1,
  },
  {
    label: '模糊匹配',
    value: 0,
  },
];

const PUSH_STATUS = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '未推送',
    value: 0,
  },
  {
    label: '已推送',
    value: 1,
  },
  {
    label: '不推送',
    value: 5,
  },
  {
    label: '已召回',
    value: 2,
  },
  {
    label: '已退回',
    value: 3,
  },
  {
    label: '已修改',
    value: 4,
  },
];

const PROCESS = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '未读',
    value: 0,
  },
  {
    label: '跟进中',
    value: 6,
  },
  {
    label: '已完成',
    value: 9,
  },
  {
    label: '已忽略',
    value: 12,
  },
  {
    label: '已放弃',
    value: 15,
  },
];
// 审核管理列表-资产信息
const ASSETS_INFO = [
  {
    lable: '债 务 人',
    key: 'obName',
  },
  {
    lable: '证 件 号',
    key: 'obNumber',
  },
  {
    lable: '所在省份',
    key: 'address',
  },
  {
    lable: '负责人/机构',
    key: 'orgName',
  },
  {
    lable: '更新时间',
    key: 'updateTime',
  },
];

// 审核管理列表-拍卖信息
const AUCTION_INFO = [
  {
    lable: '处置机关',
    key: 'court',
  },
  {
    lable: '省份名称',
    key: 'province',
  },
  {
    lable: '开拍时间',
    key: 'start',
  },
  {
    lable: '评估价格',
    key: 'consultPrice',
  },
  {
    lable: '拍卖状态',
    key: 'pmStatus',
  },
  {
    lable: '起拍价格',
    key: 'initialPrice',
  },
];

export {
  SORTER_TYPE,
  CUSTOMER_LIST,
  AUCTION_STATUS,
  DEBTORES_TYPE,
  ACTION_TYPE,
  TOP_ORG_STATUS,
  orgType,
  OPERA_MODULE_LIST,
  OPERATION_TYPE,
  DOCUMENT_DETAIL,
  COLLATERAL_TYPE,
  HOUSE_TYPE,
  DOCUMENTFIND_STATUS,
  WSINATTACH_STATUS,
  MYORG_LIST,
  IMPORTANT_TYPE,
  PROCESS,
  PUSH_STATUS,
  ASSETS_INFO,
  AUCTION_INFO,
};
