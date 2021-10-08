import {
  defineComponent, getCurrentInstance, reactive, onMounted,
} from 'vue';
import './style.scss';
import empty from '@/assets/img/no_data.png';
import { monitorApiColumn } from '@/static/column';
import monitorApi from '@/server/api/monitor-api';
import HeaderMessage from './header-message';
import PermissionModal from './permission-modal';

const sortData = {
  startDate: 'START',
  endDate: 'EXPIRE',
  ascending: 'ASC',
  descending: 'DESC',
};
export default defineComponent({
  components: {
    HeaderMessage,
    PermissionModal,
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const tableData = reactive({
      data: [],
      loading: false,
      empty: {
        empty: () => <div><img src={empty} alt="" /><p>暂无数据</p></div>,
      },
      page: 1,
      num: 10,
      total: 0,
      headerData: {},
    });
    const sort = reactive({
      sortColumn: 'DEFAULT',
      sortOrder: null,
    });
    const getList = () => {
      tableData.loading = true;
      const params = {
        num: tableData.num,
        page: tableData.page,
        ...sort,
      };
      monitorApi.getList(params).then((res) => {
        const { code, data, message } = res.data || {};
        tableData.loading = false;
        if (code === 200) {
          const { list, page, total } = data || {};
          const lists = JSON.stringify(list).replace(/null/g, `"${'-'}"`);
          tableData.data = JSON.parse(lists);
          tableData.page = page;
          tableData.total = total;
        } else {
          proxy.$message.error(message);
        }
      });
    };
    const getNums = () => {
      monitorApi.nums().then((res) => {
        const { code, data, message } = res.data || {};
        if (code === 200) {
          tableData.headerData = { ...data };
        } else {
          proxy.$message.error(message);
        }
      });
    };
    onMounted(() => {
      getList();
      getNums();
    });

    const showPermissionModal = (row) => {
      const { handleOpen } = proxy.$refs.permissionModal;
      handleOpen(row);
    };
    const handleSortChange = ({ prop, order }) => {
      sort.sortColumn = sortData[prop];
      sort.sortOrder = sortData[order];
      getList();
    };
    const pageChange = (val) => {
      tableData.page = val;
      getList();
    };
    const action = ({ row }) => <div>
      <a className="action-span" onClick={() => showPermissionModal(row)}>权限管理</a>
    </div>;
    const showExpire = ({ row }) => <span>{row.orgName}
      {row.isExpire ? <i class="iconfont iconyiguoqi"
                             key={row.id}
                             style="font-size: 17px;color: #F93535;margin-left: 4px"
      /> : ''}</span>;
    const resetList = () => {
      getList();
      getNums();
    };
    return {
      tableData,
      handleSortChange,
      pageChange,
      action,
      resetList,
      showExpire,
    };
  },
  render() {
    const {
      tableData,
      handleSortChange,
      pageChange,
      action,
      resetList,
      showExpire,
    } = this;
    return (
      <div className="monitor-api-content">
        <div className="monitor-api-content-header">
          <span className="monitor-api-content-header-title">API监控管理</span>
          <HeaderMessage ref="HeaderMessage" data={tableData.headerData}/>
        </div>
        <div className="monitor-api-content-body">
          <el-table
            v-loading={tableData.loading}
            ref="monitorTable"
            data={tableData.data}
            onSortChange={handleSortChange}
            row-key={(val) => val.id}
            v-slots={tableData.empty}
          >
            { monitorApiColumn.map((i, index) => (i.prop !== 'orgName' ? <el-table-column
              label={i.label}
              key={`${i.label}${index}`}
              prop={i.prop}
              width={i.width}
              align={i.align}
              sortable={i.sort}
              /> : <el-table-column
                label={i.label}
                key={`${i.label}${index}`}
                prop={i.prop}
                width={i.width}
                align={i.align}
                sortable={i.sort}
                v-slots={(scope) => showExpire(scope)}
              />))
            }
              <el-table-column label="操作" key="action" v-slots={(scope) => action(scope)}/>
          </el-table>
          <el-pagination
            onCurrentChange={pageChange}
            current-page={tableData.page}
            page-size={tableData.num}
            layout="total, prev, pager, next, jumper"
            total={tableData.total}
            key={tableData.page}
            hide-on-single-page={tableData.total === 0}
          />
          <Permission-modal ref="permissionModal" onResetList={resetList}/>
        </div>
      </div>
    );
  },
});
