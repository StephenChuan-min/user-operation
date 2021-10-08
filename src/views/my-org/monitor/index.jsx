import {
  defineComponent, getCurrentInstance, ref, reactive,
} from 'vue';
import { monitorTabs } from '@/static/fn';
import { MONITOR_LIST } from '@/static';
import { dateUtils } from '@/utils';
import MyOrgApi from '@/server/api/my-org';
import Tree from './tree/tree';
import Query from './query/query';
import Table from './table/table';
import './style.scss';

export default defineComponent({
  components: {
    Tree,
    Query,
    Table,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    // 处理浏览器标签页标题 以及orgId
    const { name, id } = proxy.$root.$route.query;
    const headerTitle = `${name}-监控管理`;
    document.title = `【监控管理】${name}`;
    const idData = reactive({
      orgId: id,
      activeId: id,
    });

    // tab切换
    const tabKey = ref('1');
    const unReadNum = ref(0);
    const getTabNum = (ID) => {
      const params = {
        orgId: ID,
      };
      MyOrgApi.readNot(params).then((res) => {
        const { code, message, data = 0 } = res.data;
        if (code === 200) {
          // 赋值未读数量
          unReadNum.value = data;
        } else {
          proxy.$message.error(message);
        }
      });
    };

    const tableData = reactive({
      data: [],
      loading: false,
      page: 1,
      total: 0,
      num: 10,
    });
    let queryParams = reactive({});
    const resetSort = () => {
      const { resetTable, multiple } = proxy.$refs.Table;
      multiple.isChecked = false;
      if (queryParams.sortColumn) delete queryParams.sortColumn;
      if (queryParams.sortOrder) delete queryParams.sortOrder;
      resetTable();
    };

    const setParams = (type) => {
      let param = {};
      if (type === 'search') {
        const { state } = proxy.$refs.monitorQuery;
        param = { ...state };
      } else {
        param = { ...queryParams };
      }
      const params = Object.assign(param, { orgId: idData.activeId, type: tabKey.value }, { page: tableData.page, num: tableData.num });
      if (params.approveTimeEnd) params.approveTimeEnd = dateUtils.formatStandardDate(params.approveTimeEnd);
      if (params.approveTimeStart) params.approveTimeStart = dateUtils.formatStandardDate(params.approveTimeStart);
      if (params.createTimeStart) params.createTimeStart = dateUtils.formatStandardDate(params.createTimeStart);
      if (params.createTimeEnd) params.createTimeEnd = dateUtils.formatStandardDate(params.createTimeEnd);
      if (params.updateTimeStart) params.updateTimeStart = dateUtils.formatStandardDate(params.updateTimeStart);
      if (params.updateTimeEnd) params.updateTimeEnd = dateUtils.formatStandardDate(params.updateTimeEnd);
      if (params.startStart) params.startStart = dateUtils.formatStandardDate(params.startStart);
      if (params.startEnd) params.startEnd = dateUtils.formatStandardDate(params.startEnd);
      return { ...params };
    };

    const getList = (type) => {
      tableData.loading = true;
      if (type) queryParams = { ...proxy.$refs.monitorQuery.state };
      const params = setParams(type);
      MyOrgApi.monitorList(params).then((res) => {
        const { code, data = {} } = res.data;
        if (code === 200) {
          const { list = [], total } = data;
          tableData.data = list;
          if (tabKey.value === '0') unReadNum.value = total;
          tableData.total = total;
        }
        tableData.loading = false;
      });
    };
    // 树节点点击  搜索
    const treeNodeClick = (ID) => {
      // 根据节点id进行搜索，清空搜索条件
      idData.activeId = ID;
      tabKey.value = '1';
      getTabNum(idData.activeId);
      const { resetSearch, deleteStatus } = proxy.$refs.monitorQuery;
      deleteStatus(true);
      resetSearch();
    };
    const tabChange = (val) => {
      // val.props.name
      tabKey.value = val.props.name;
      tableData.page = 1;
      const { deleteStatus } = proxy.$refs.monitorQuery;
      if (tabKey.value === '0') {
        deleteStatus(false);
      } else {
        deleteStatus(true);
        getTabNum(idData.activeId);
      }
      resetSort();
      getList();
    };
    // 搜索 清空搜索条件
    const resetSearch = () => {
      tableData.page = 1;
      resetSort();
      getList('search');
    };
    const handleSearch = () => {
      tableData.page = 1;
      resetSort();
      getList('search');
    };

    const handleExport = () => {
      // 将筛选条件传入
      const { exportAction } = proxy.$refs.Table;
      const params = setParams();
      exportAction(params);
    };

    // 分页
    const pageChange = (page) => {
      tableData.page = page;
      getList();
    };
    const sizeChange = (num) => {
      tableData.page = 1;
      tableData.num = num;
      getList();
    };
    const sortChange = ({ prop, order }) => {
      tableData.page = 1;
      queryParams = {
        ...queryParams,
        sortColumn: MONITOR_LIST[prop],
        sortOrder: MONITOR_LIST[order],
      };
      getList();
    };

    return {
      headerTitle,
      idData,
      unReadNum,
      tabKey,
      tabChange,
      treeNodeClick,
      tableData,
      resetSearch,
      handleSearch,
      handleExport,
      pageChange,
      sizeChange,
      sortChange,
    };
  },
  render() {
    const {
      headerTitle, idData, tabKey, tabChange, unReadNum, treeNodeClick, tableData, handleSearch, resetSearch, handleExport, pageChange, sizeChange, sortChange,
    } = this;

    return (
      <div className="yc-newpage-contaner" id="lalal">
        <div className="monitor-manage">
          <div className="monitor-manage-header">
            <span className="header-title">
              {headerTitle}
            </span>
            <span className="data-type">
              <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
                <use xlink:href="#iconshujuleixing"/>
              </svg>
              <span className="middle">当前数据类型：</span>
              <span className="right">资产拍卖</span>
            </span>
          </div>
          <div className="monitor-manage-body">
            <div className="left-tree">
              <Tree
                orgId={idData.orgId}
                onTreeNodeClick={treeNodeClick}
              />
            </div>
            <div className="query-data">
              <div className="query-area">
                <Query ref="monitorQuery" onHandleSearch={handleSearch} onResetSearch={resetSearch}/>
              </div>
              <div className="data-area">
                <div>
                  <el-tabs v-model={tabKey} onTabClick={tabChange} class="monitor-tabs">
                    { monitorTabs(unReadNum).map((item) => (
                      <el-tab-pane
                        key={item.value}
                        label={item.label}
                        name={item.value}
                      />
                    )) }
                  </el-tabs>
                </div>
                <Table
                  tableData={tableData}
                  onExport={handleExport}
                  ref="Table"
                  onPageChange={pageChange}
                  onSizeChange={sizeChange}
                  onSortChange={sortChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
