import {
  defineComponent, getCurrentInstance, reactive, toRaw,
} from 'vue';
import { auditColumn } from '@/static/column';
import { fileDownload, clearEmpty } from '@/utils';
import $modalConfirm from '@/utils/better-el';
import ZcInfo from '@/components/column-pane/zcInfo';
import PmInfo from '@/components/column-pane/pmInfo';
import ppbzInfo from '@/components/column-pane/ppbzInfo';
import MyOrgApi from '@/server/api/my-org';
import { PROCESS } from '@/static';
import empty from '@/assets/img/no_data.png';
import './style.scss';

const width = ['20%', '35%', '35%', '10%'];
const column = auditColumn.map((item, index) => Object.assign(item, { width: width[index] }));
const processList = [...PROCESS];
processList.splice(2, 0, {
  label: '未跟进',
  value: 1,
});
export default defineComponent({
  components: {
    ZcInfo,
    PmInfo,
    ppbzInfo,
  },
  props: {
    tableData: Object,
  },
  emits: ['pageChange', 'export', 'sortChange'],
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const setTablePane = (row, type) => {
      if (type === 'assetInfo') return <ZcInfo data={row}/>;
      if (type === 'remarkInfo') return <ppbzInfo data={row}/>;
      if (type === 'auctionInfo') return <PmInfo data={row}/>;
      const status = processList.filter((i) => i.value === row.process);
      return <span>{status[0].label}</span>;
    };

    // 批量选择
    const multiple = reactive({
      isChecked: false,
      multipleSelection: [],
      info: {},
      idList: [],
      empty: {
        empty: () => <div><img src={empty} alt="" /><p>暂无数据</p></div>,
      },
    });
    const resetTable = () => {
      const { clearSelection, clearSort } = proxy.$refs.multipleTable;
      clearSelection();
      clearSort();
      multiple.isChecked = false;
      multiple.multipleSelection = [];
    };
    // 排序
    const handleSortChange = (sort) => {
      // 排序查询
      const { clearSelection } = proxy.$refs.multipleTable;
      clearSelection();
      multiple.isChecked = false;
      multiple.multipleSelection = [];
      emit('sortChange', sort);
    };
    const pageChange = (page) => {
      emit('pageChange', page);
    };

    const handleBatchCheck = (isChecked) => {
      multiple.isChecked = isChecked;
      if (!isChecked) {
        const { clearSelection } = proxy.$refs.multipleTable;
        clearSelection();
        multiple.multipleSelection = [];
      }
    };
    const handleExport = (type) => {
      if (!type && !multiple.multipleSelection.length) {
        proxy.$message.warning('未选中数据');
        return;
      }
      multiple.info = type ? {
        text: '点击确定，将为您导出所有信息',
        title: '确认导出所有信息吗？',
      } : {
        text: '点击确定，将为您导出选中的所有信息',
        title: '确认导出选中的所有信息吗？',
      };
      multiple.idList = type ? [] : multiple.multipleSelection.map((item) => item.auctionId);
      emit('export');
    };
    const exportAction = (param) => {
      const paramData = {
        condition: {
          ...toRaw(clearEmpty(param)),
        },
        idList: multiple.idList,
      };
      $modalConfirm(multiple.info).then(() => {
        const modalMsg = proxy.$message.warning({
          message: '正在下载，请稍等...',
          duration: 1000,
        });
        MyOrgApi.auditExport(paramData).then((res) => {
          const { code = 200, message = '' } = res;
          if (code === 200) {
            fileDownload(res);
          } else {
            proxy.$message.error(message);
          }
        }, () => {
          modalMsg.close();
        });
      }).catch((err) => {
        console.log(err);
      });
    };

    return {
      setTablePane, multiple, handleBatchCheck, handleExport, handleSortChange, exportAction, pageChange, resetTable,
    };
  },
  render() {
    const {
      setTablePane, tableData = {}, multiple, handleBatchCheck, handleExport, handleSortChange, pageChange,
    } = this;
    return (
      <div className="monitor-table">
        <div className="table-content-btn">
          <el-button
            type="primary"
            v-show={!multiple.isChecked}
            onClick={() => handleBatchCheck(true)}
            class="button-third"
            icon="iconfont iconyonghuyunying-piliangguanli"
            style={{ padding: '0 11px', marginRight: '12px' }}>
            批量管理
          </el-button>
          <el-button
            type="primary"
            v-show={!multiple.isChecked}
            onClick={() => handleExport('all')}
            class="button-third"
            icon="iconfont iconyonghuyunying-daochu"
            style={{ padding: '0 11px' }}
          >
            一键导出
          </el-button>
          <el-button
            type="primary"
            v-show={multiple.isChecked}
            onClick={() => handleBatchCheck(false)}
            class="button-second"
            style={{ marginRight: '12px' }}
          >取消批量管理
          </el-button>
          <el-button
            onClick={() => handleExport('')}
            class="button-fourth"
            v-show={multiple.isChecked}
          >导出
          </el-button>
          <span v-show={(multiple.multipleSelection || []).length} className="total-tips">
            <svg
              class="icon"
              aria-hidden="true"
              style={{
                marginRight: '3px',
                fontSize: '16px',
                position: 'relative',
                top: '1px',
              }}
            >
              <use xlink:href="#iconxuanzhongshuju"/>
            </svg>
            已选中 <b>{(multiple.multipleSelection || []).length}</b> 条数据
            </span>
        </div>
        <el-table
          data={tableData.data}
          style={{ width: '100%' }}
          ref="multipleTable"
          v-loading={tableData.loading}
          tooltip-effect="dark"
          onSelectionChange={(val) => (multiple.multipleSelection = val)}
          onSortChange={handleSortChange}
          row-key={(val) => val.id}
          v-slots={multiple.empty}
          row-class-name="row-class"
        >
          {
            multiple.isChecked ? <el-table-column
              class="check-column"
              type="selection"
              width="55"
              reserve-selection={true}
            /> : ''
          }
          { column.map((i) => <el-table-column
            label={i.label}
            key={i.class}
            prop={i.prop}
            min-width={i.width}
            sortable={i.sort}
            v-slots={(scope) => setTablePane(scope.row, i.prop)}/>)}
        </el-table>
        <el-pagination
          onCurrentChange={pageChange}
          background
          current-page={tableData.page}
          page-size={tableData.num}
          layout="total, prev, pager, next, jumper"
          total={tableData.total}
          key={tableData.page}
          hide-on-single-page={tableData.total === 0}
        />
      </div>
    );
  },
});
