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

const MONITOR_LIST = {
  auctionInfo: 'AUCTIONTIME',
  assetInfo: 'UPDATETIME',
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
  0: '-',
  1: '无抵押',
  2: '-',
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
  0: '-',
  1: '详情见资产拍卖附件',
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
const AUDITTYPE = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '自动审核',
    value: 0,
  },
  {
    label: '人工审核',
    value: 1,
  },
];
// 匹配类型
const IMPORTANT_TYPE = [
  {
    label: '全部',
    value: '',
  },
  {
    label: '精准匹配',
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
    lable: '客户使用机构',
    key: 'conSumerName',
  },
  {
    lable: '更新时间',
    key: 'updateTime',
  },
];

const RECALL_REASON = [
  {
    label: '误点击',
    val: 1,
  },
  {
    label: '备注填错',
    val: 2,
  },
  {
    label: '审核出错',
    val: 3,
  },
  {
    label: '其他',
    val: 9,
  },
];

// 审核管理-不推送弹窗-默认提示文案
const NOPUSH_TIPS = [
  '债务人为个人，有身份证号。通过文书等内容查到出生日期，确定与身份证不匹配',
  '文书中多被告中的一个，但是与拍卖资产完全没有关系',
];
// 审核管理-推送弹窗-默认提示文案
const PUSH_TIPS = [
  {
    title: '文书或附件',
    key: 'wsfj',
    desc: [
      '经裁判文书分析，债务人被他方起诉，涉诉债权额xx万元本金及相应利息，详情见[文书链接|http://www.baidu.com/]',
      '经资产拍卖页面分析，债务人被他方起诉，涉诉债权额xx万元本金及相应利息，详情见拍卖页面附件',
    ],
  },
  {
    title: '未查询到相关文书或个人身份信息的情况',
    key: 'nosearch',
    desc: [
      '通过公开渠道未查询到相关文书，贵行可进一步核实是否有可分配的余值',
      '通过公开渠道未查询到相关文书及个人身份信息，存在重名的可能，贵行可进一步核实是否有可分配的余值',
      '通过公开渠道未查询到相关文书内容，贵行可进一步核实是否有可分配的余值，相关文书案号：',
    ],
  },
  {
    title: '资产线索',
    key: 'zcxs',
    desc: [
      '被拍卖的资产为xxx所有，但xxx为xx有限公司（债务人）的法人，贵行或可通过此线索，尽快联系相关法院，核实是否能追讨相应的权益',
      '被拍卖的资产为xxx所有，但xxx与xx（债务人）为夫妻关系，贵行或可通过此线索，尽快联系相关法院，核实是否能追讨相应的权益',
      '被拍卖的资产为xxx所有，但xxx为xx有限公司（债务人）的法人，xxx被他方起诉，详情见[文书链接|http://www.baidu.com/]',
      '被拍卖的资产为xxx所有，但xxx与xx（债务人）为夫妻关系，xxx被他方起诉，详情见[文书链接|http://www.baidu.com/]',
      '经资产拍卖信息分析，杭州xx公司为宁波xx公司的股东之一，持股10%，贵行或可通过此线索，尽快联系相关法院，核实是否能追讨相应的权益',
    ],
  },
  {
    title: '抵押权或代位权',
    key: 'dydwq',
    desc: [
      '经资产拍卖信息分析发现债务人为拍卖资产的抵押权人，贵行或可通过此线索，追讨一定相关权益',
      '经裁判文书分析，债务人为拍卖资产的抵押权人，贵行或可通过此线索，追讨一定相关权益，详情见[文书链接|http://www.baidu.com/]',
      '经拍卖信息分析，债务人杭州XX有限公司作为原告，起诉****，****的资产依法拍卖，详情见拍卖页面附件',
      '经裁判文书分析，债务人杭州XX有限公司作为原告，起诉****，****的资产依法拍卖，详情见[文书链接|http://www.baidu.com/]',
    ],
  },
  {
    title: '竞买成功',
    key: 'jmcg',
    desc: [
      '经资产拍卖分析，此资产的买受人与债务人名称一致，且资产与债务人所在地为同一省（市），但由于通过公开渠道未查询到个人身份信息，可能存在重名的情况，需贵行进一步核实相关信息',
      '经资产拍卖分析，债务人成功竞买一处资产，贵行需尽快联系法院，核实能否追讨相应权益',
    ],
  },
  {
    title: '疑似所有人',
    key: 'yssyr',
    desc: [
      '通过案号匹配债务人为关联案号的被告，但通过公开渠道无法确定债务人是否为拍卖资产的所有人，贵行可进一步核实，是否能追讨相应的权益',
      '通过公开渠道无法确定债务人是否为拍卖资产的所有人，贵行可进一步核实，是否能追讨相应的权益',
      '通过公开渠道无法确定债务人是否为拍卖资产的所有人，贵行可进一步核实，是否能追讨相应的权益，详情见[文书链接|http://www.baidu.com/]',
    ],
  },
  {
    title: '无抵押的情况',
    key: 'wdy',
    desc: [
      '经资产拍卖信息分析发现此资产无抵押，贵行或可通过此线索，追讨一定相关权益',
      '经裁判文书分析，拍卖资产可能存在无抵押情况，详情见[文书链接|http://www.baidu.com/]',
    ],
  },
];
const LABEL_TYPE = {
  1: '资产所有人',
  2: '债权人',
  3: '资产线索',
  5: '竞买人',
};
const GENDER_TYPE = {
  0: '未知',
  1: '男',
  2: '女',
};

// 匹配类型
const MATCH_TYPE = {
  0: '模糊',
  1: '精确',
};

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
  MONITOR_LIST,
  RECALL_REASON,
  NOPUSH_TIPS,
  PUSH_TIPS,
  LABEL_TYPE,
  GENDER_TYPE,
  MATCH_TYPE,
  AUDITTYPE,
};
