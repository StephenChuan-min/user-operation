import orgData from '@/assets/img/org_data.png';
import newAddDebtor from '@/assets/img/newadd_debtor.png';
import corOrg from '@/assets/img/cor_org.png';
import outDate from '@/assets/img/outdate.png';
import monitorDebtor from '@/assets/img/monitor_debtor.png';

const workbenchTopAsset = [
  {
    id: 'first',
    img: orgData,
    title: '正式机构数据推送量',
    describe: '',
    left: { id: 'first_left', field: 'lastDayPush', subtitle: '昨日数据推送量' },
    right: { id: 'first_right', field: 'avgPush', subtitle: '近半年日均推送量' },
  },
  {
    id: 'second',
    img: newAddDebtor,
    title: '昨日新增债务人',
    describe: '',
    left: { id: 'second_left', field: 'incrFormalOrg', subtitle: '正式机构' },
    right: { id: 'second_right', field: 'incrTrialOrg', subtitle: '试用机构' },
    key: 2,
  },
  {
    id: 'third',
    img: corOrg,
    title: '合作机构数',
    describe: '历史合作机构总数：',
    left: { id: 'third_left', field: 'formalContractOrg', subtitle: '正式机构' },
    right: { id: 'third_right', field: 'trialContractOrg', subtitle: '试用机构' },
    up: { field: 'historyContract' },
    key: 3,
  },
  {
    id: 'fourth',
    img: outDate,
    icon: true,
    title: '即将过期机构数',
    describe: '过期两个月内机构总数：',
    left: { id: 'fourth_left', field: 'willExpireFormalOrg', subtitle: '正式机构' },
    right: { id: 'fourth_right', field: 'willExpireTrialOrg', subtitle: '试用机构' },
    up: { field: 'expiredOrg' },
    key: 4,
  },
  {
    id: 'fifth',
    img: monitorDebtor,
    title: '监控债务人数',
    describe: '',
    left: { id: 'fifth_left', field: 'formalOrgObligor', subtitle: '正式机构' },
    right: { id: 'fifth_right', field: 'trialOrgObligor', subtitle: '试用机构' },
    key: 5,
  },
];
const columns = [
  {
    prop: 'name',
    label: '顶级合作机构名称',
    align: 'left',
    key: 1,
  },
  {
    prop: 'end',
    label: '合同结束日期',
    align: 'left',
    sortable: 'custom',
    key: 2,
  },
  {
    prop: 'lastDayObligor',
    label: '昨日新增债务人数',
    align: 'center',
    sortable: 'custom',
    key: 3,
  },
  {
    prop: 'lastDayPush',
    label: '昨日推送量',
    align: 'center',
    sortable: 'custom',
    key: 4,
  },
  {
    prop: 'lastWeekObligor',
    label: '上周新增债务人数',
    align: 'center',
    sortable: 'custom',
    key: 5,
  },
  {
    prop: 'lastWeekPush',
    label: '上周推送量',
    align: 'center',
    sortable: 'custom',
    key: 6,
  },
];
export {
  workbenchTopAsset,
  columns,
};
