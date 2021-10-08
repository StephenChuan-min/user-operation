import {
  defineComponent, onMounted,
} from 'vue';

import { auditTabs } from '@/static/fn';
import { auditColumn } from '@/static/column';
import { selectSlots, timeLineSlots, tableEmptytSlots } from '@/static/slot';

import NoOrgImg from '@/assets/img/no_org.png';
import mainModule from './business/main';
import columnHtml from './business/table';
import modalModule from './business/modal';
import Query from './view/query';
import './style.scss';

const option = [{ label: '正式', val: 1 }, { label: '试用', val: 0 }];

export default defineComponent({
  setup() {
    // 列表相关逻辑
    const {
      state,
      queryState,
      handleSearch,
      pageChange,
      treeItemChange,
      typeChange,
      sortChange,
      isNewPageClose,
      getTreeList,
      getList,
      handleReset,
    } = mainModule();
    // 弹框相关逻辑
    const {
      openModal, modalState, modalHtml, modalSlots,
    } = modalModule(getList);

    // 打开结构化详情页面
    const toDetail = (auctionId) => {
      window.open(`/structureCheck/${auctionId}`, '_blank');
    };
    // 获取操作列
    const ColumnAction = (props) => {
      const { auctionId } = props || {};
      const { tableType } = queryState;
      const fn = Number(tableType) % 2 !== 0;
      const params = {
        ...props,
        tableType,
      };
      return <div className='action-column'>
        <el-button type="text" class='button-link top' onClick={() => toDetail(auctionId)}>结构化校验</el-button>
        {fn && <el-button type="primary" class='button-fourth middle' onClick = {() => openModal('push', params) }>推送</el-button>}
        {fn && tableType !== '3' && <el-button type="primary" class='button-fourth btm' onClick = {() => openModal('noPush', params) }>不推送</el-button>}
        {tableType === '4' && <el-button type="primary" class='button-fourth btm' onClick = {() => openModal('reCall', params) }>召回</el-button>}
      </div>;
    };

    onMounted(() => {
      getTreeList();
      isNewPageClose();
      document.title = '审核管理';
    });
    return {
      state,
      queryState,
      modalState,
      modalHtml,
      modalSlots,
      handleSearch,
      ColumnAction,
      pageChange,
      treeItemChange,
      typeChange,
      sortChange,
      handleReset,
    };
  },
  render() {
    const {
      state,
      queryState,
      treeItemChange,
      typeChange,
      ColumnAction,
      pageChange,
      modalState,
      modalSlots,
      modalHtml,
      handleSearch,
      sortChange,
      handleReset,
    } = this;
    const type = { 0: '试用', 1: '正式' };
    const list = this.state.allList.map((i) => ({ ...i, name: `${i.name}（${type[i.type]}）` }));
    const hasData = (state.treeList || []).length;
    const { readNotNum, recallNum } = state;
    return (
        <div className="yc-container audit-management-container">
            {/* 左侧树 */}
            <div className="content-left">
              <div className="content-left-tree">
                <div className="content-left-tree-query">
                  <el-select v-model={queryState.orgId} filterable placeholder="请输入顶级机构名称" v-slots={selectSlots} style={{ width: '100%', marginBottom: '16px' }} popper-class='content-left-tree-query-select' ref='selectRef'>
                    {
                      list.map((i) => <el-option key={i.id} label={i.name} value={i.id} onClick={() => treeItemChange(i.id, 'query')}></el-option>)
                    }
                  </el-select>
                </div>
                <div className="content-left-tree-tabs">
                    <div className="content-left-tree-tabs-content">
                      <el-radio-group v-model={state.type} onChange={() => typeChange('clear')}>
                        {
                          option.map((i) => <el-radio-button label={i.val} key={i.val}>{ i.label}</el-radio-button>)
                        }
                      </el-radio-group>
                    </div>
                </div>
                <div className="content-left-tree-list" style={{ height: state.height }} id='treeList' v-show={hasData}>
                    <div className="content-left-tree-list-title cursor-pointer" onClick={() => treeItemChange('', 'all')}>
                      <svg className="icon" aria-hidden="true" style={{ width: '18px', height: '18px', marginRight: '8px' }}>
                        <use xlink:href="#iconyonghuyunying-quanbushiyongjigou"></use>
                      </svg>
                      <span className={!queryState.orgId ? 'active' : ''} id={!queryState.orgId ? 'active' : ''}>全部{type[state.type]}机构</span>
                    </div>
                    <div className='content-left-tree-list-content'>
                      <el-timeline>
                        {
                          state.treeList.map((i) => (
                            <el-timeline-item
                              key={i.id}
                              v-slots={timeLineSlots}
                              onClick={() => treeItemChange(i.id)}
                              className={`${queryState.orgId === i.id ? 'active' : ''} el-timeline-item cursor-pointer` }
                              id={`${queryState.orgId === i.id ? 'active' : ''}` }
                            >
                              <el-tooltip
                                effect="dark"
                                content= {i.name}
                                placement="top"
                                disabled= {(i.name || '').length < 16}
                              >
                                <div style={{ width: '230px' }} class='yc-ellipsis'>
                                  {i.name}
                                </div>
                              </el-tooltip>
                            </el-timeline-item>))
                        }
                      </el-timeline>
                    </div>
                </div>
                <div className="content-left-tree-no-data" v-show={!hasData}>
                  <img src={NoOrgImg} alt="" />
                  <p>暂无数据</p>
                </div>
              </div>
            </div>
            <div className="content-right" id='content-right' ref='RightRef'>
              {/* 列表搜索条件 */}
              <Query ref="queryRef" tableType={queryState.tableType} onHandleSearch={handleSearch} onHandleClearQuery = {handleSearch}/>
              {/* 列表 */}
              <div className="content-right-table">
                  <div className="content-right-table-tabs">
                    <el-tabs v-model={queryState.tableType} onTabClick={handleReset}>
                      {
                        auditTabs(readNotNum, recallNum).map((i) => (
                          <el-tab-pane
                            label={i.label}
                            name={i.name}
                            key={i.name}
                          />
                        ))
                      }
                    </el-tabs>
                  </div>
                <div className="content-right-table-list">
                  <el-table
                    data={state.tableList}
                    v-loading={state.loading}
                    v-slots={tableEmptytSlots}
                    row-key={(val) => val.id}
                    onSortChange={sortChange}
                    ref="tableRef"
                  >
                    {
                      auditColumn.map((i) => (
                        <el-table-column
                          label={i.label}
                          key={i.prop}
                          prop={i.prop}
                          min-width={i.width}
                          className ={i.prop}
                          sortable={i.sort}
                          v-slots={(scope) => <div className='column-item-content'>{columnHtml(scope.row, queryState.tableType)[i.prop]}</div>}
                        />
                      ))
                    }
                    <el-table-column label="操作" min-width='10%' align='center' className='action' v-slots={(scope) => <ColumnAction {...scope.row}/>}/>
                  </el-table>
                  <el-pagination
                    onCurrentChange={pageChange}
                    background
                    current-page={state.page}
                    layout='total, prev, pager, next, jumper'
                    total={state.total}
                    key={state.page}
                    hide-on-single-page={state.total === 0}
                />
                </div>
              </div>
            </div>
          {/* 弹框 */}
          <div className="content-modal yc-custom-modal">
            <el-dialog
              v-model={modalState.visible}
              width={modalState.type === 'reCall' ? '556px' : '500px'}
              destroy-on-close
              show-close={false}
              v-slots={modalSlots}
              customClass={modalState.type}
            >
              {modalHtml[modalState.type]}
            </el-dialog>
          </div>
        </div>
    );
  },
});
