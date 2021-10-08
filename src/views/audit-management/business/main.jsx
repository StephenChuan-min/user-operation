import {
  getCurrentInstance, nextTick, reactive, toRaw,
} from 'vue';
import { dateUtils } from '@/utils';
import CommonApi from '@/server/api/common';
import { MONITOR_LIST } from '@/static';

const option = [{ label: '正式', val: 1 }, { label: '试用', val: 0 }];
const mainModule = () => {
  const { proxy } = getCurrentInstance();
  const state = reactive({
    type: 1,
    allList: [],
    treeList: [],
    height: '72vh',
    tableList: [],
    page: 1,
    num: 10,
    total: 0,
    readNotNum: '0',
    recallNum: '0',
    loading: false,
    queryOptions: {},
  });
  const queryState = reactive({
    num: 10, // 每页条数，默认20 ,示例值(20)
    orgId: '', // 机构id
    page: 1, // 页数
    sortColumn: '', // 排序字段,可用值:AUCTIONTIME,UPDATETIME
    sortOrder: '', // 排序顺序,可用值:ASC,DESC
    tableType: '1', // 查询列表标签 1:结构化匹配 2:已推送 3:不推送 4:客户未读 5:召回
  });
  // 获取请求列表参数
  const getParams = () => {
    const f = (i) => dateUtils.formatStandardDate(i);
    const {
      createTimeStart, createTimeEnd, approveTimeStart, approveTimeEnd, startStart, startEnd, updateTimeEnd, updateTimeStart, ...rest
    } = state.queryOptions;
    const obj = {
      createTimeStart, createTimeEnd, approveTimeStart, approveTimeEnd, updateTimeEnd, updateTimeStart, startStart, startEnd,
    };
    const { tableType, sortColumn, sortOrder } = queryState;
    Object.keys(obj).forEach((i) => obj[i] = f(obj[i]));
    const params = {
      ...obj,
      ...rest,
      ...queryState,
      orgType: (state.type).toString(),
      page: queryState.page,
      isOpen: '',
      flag: tableType === '5' ? Boolean(sortColumn && sortOrder) : '',
    };
    return params;
  };
  // 请求列表数据
  const getList = () => {
    state.loading = true;
    const params = getParams();
    CommonApi.getAuditList(params).then((res) => {
      const { code, data } = res.data || {};
      if (code === 200) {
        const {
          list, numInfo,
        } = data || {};
        const { page, total } = list || {};
        const { readNotNum, recallNum } = numInfo || {};
        state.tableList = list.list || [];
        state.page = page;
        state.total = total;
        state.readNotNum = readNotNum || '0';
        state.recallNum = recallNum || '0';
        // setTreeMinHeight();
      } else {
        proxy.$message.error('请求出错');
      }
    }).finally(() => {
      state.loading = false;
    });
  };
  // 重置排序 页码
  const handleReset = () => {
    const { clearSort } = proxy.$refs.tableRef;
    clearSort();
    queryState.page = 1;
    queryState.sortColumn = '';
    queryState.sortOrder = '';
    getList();
  };
  // 搜索
  const handleSearch = (sign) => {
    if (sign === 'search') {
      state.queryOptions = proxy.$refs.queryRef.state || {};
    }
    handleReset();
  };
  const scrollIntoView = () => {
    nextTick(() => {
      const dom = document.getElementById('active');
      if (dom) {
        dom.scrollIntoView({ block: 'center' });
      }
    }).then((r) => console.log(r));
  };
  // 机构类型切换
  const typeChange = (isClear) => {
    const { resetForm } = proxy.$refs.queryRef;
    const { allList, type } = state;
    queryState.tableType = '1';
    state.treeList = allList.filter((i) => i.type === state.type) || [];
    if (isClear === 'clear') {
      queryState.orgId = '';
      proxy.$router.push(`/auditManagement/${type ? -1 : -2}`);
      scrollIntoView();
      resetForm();
    }
  };
  // 顶级机构切换
  const treeItemChange = (id, sign) => {
    const { treeList, type } = toRaw(state);
    queryState.tableType = '1';
    let orgId = id;
    if (sign === 'all') {
      orgId = type ? -1 : -2;
    }
    if (sign === 'query') {
      if (id < 0) {
        state.type = id === -1 ? 1 : 0;
      } else if (id && !(treeList.filter((i) => i.id === id) || []).length) {
        state.type = option.find((i) => i.val !== type).val;
      }
      typeChange();
    }
    queryState.orgId = id < 0 ? '' : id;
    proxy.$router.push(`/auditManagement/${orgId}`);
    scrollIntoView();
    const { blur } = proxy.$refs.selectRef;
    nextTick(() => blur()).then((r) => console.log(r));
    handleReset();
  };
  // 获取顶级机构列表
  const getTreeList = () => {
    const { id } = proxy.$route.params;
    CommonApi.listTopOrg().then((res) => {
      const { code, data = [] } = res.data || {};
      if (code === 200) {
        state.allList = data;
        typeChange();
        treeItemChange(Number(id) || '', 'query');
      } else {
        proxy.$message.error('请求出错');
      }
    });
  };
  // 翻页
  const pageChange = (val) => {
    queryState.page = val;
    getList();
  };
  // 排序
  const sortChange = ({ prop, order }) => {
    queryState.page = 1;
    queryState.sortColumn = MONITOR_LIST[prop];
    queryState.sortOrder = MONITOR_LIST[order];
    getList();
  };
  // 是否为新开页（结构化校验页面）关闭
  const isNewPageClose = () => {
    window.addEventListener('storage', (e) => {
      if (e.key === 'backSign' && e.newValue === 'SUCCESS') {
        localStorage.setItem('backSign', '');
        getList();
      }
    });
  };
  return {
    state,
    queryState,
    handleSearch,
    pageChange,
    treeItemChange,
    typeChange,
    sortChange,
    isNewPageClose,
    getTreeList,
    getParams,
    getList,
    handleReset,
  };
};
export default mainModule;
