<template>
  <div class="customer-management-container">
    <div class="query-content">
      <Query
        ref="query"
        @handleQuery="handleQuery"
        @handleClear="handleClear"
      ></Query>
    </div>
    <div class="main-content">
      <div class="main-content-left">
        <CustomerTree
          ref="CustomerTree"
          :totalOrgNum="totalOrgNum"
          :totalOperatedOrgNum="totalOperatedOrgNum"
          :activities="activities"
          :activeKey="activeKey"
          :heightStyle="heightStyle"
          @handleClick="customerTreeClick"
          @toTopAction="toTopAction"
        ></CustomerTree>
      </div>
      <div class="main-content-right">
        <BreadCrumb
          ref="BreadCrumb"
          :text="title"
          :editable="editable"
          :btnText="!editable ? '创建域名机构' : '创建顶级合作机构'"
          @handleClick="showModal('add')"
          @saveName="saveName"
        >
          <template v-slot:detail v-if="editable">
            <div class="customer-detail">
              <div class="customer-detail-left">
                <div class="link">
                  <span>二级域名:</span>
                  <a :href="`https://${customerObj.subDomain}.yczcjk.com`" target='_blank' class="button-link">{{customerObj.subDomain}}</a>
                </div>
                <div class="link">
                  <span>创建时间:</span>
                  <span>{{customerObj.createTime}}</span>
                </div>
              </div>
              <div class="customer-detail-right">
                <div class="customer num1">
                  <div class="customer-type">
                    顶级合作机构（家）</div>
                  <div class="customer-num">{{customerObj.topCooperateOrgNum}}</div>
                </div>
                <div class="divider"></div>
                <div class="customer num2">
                  <div class="customer-type">正式机构（家）</div>
                  <div class="customer-num">{{customerObj.formalOrgNum}}</div>
                </div>
                <div class="divider" style="margin-right: 31px;"></div>
                <div class="customer num3">
                  <div class="customer-type">试用机构（家）</div>
                  <div class="customer-num">{{customerObj.trialOrgNum}}</div>
                </div>
              </div>
            </div>
          </template>
        </BreadCrumb>
        <div class="table-list" id="main-content-right">
          <Table ref="listTable"
                 :tableData="tableData"
                 @pageOrSizeChange="pageOrSizeChange"
                 @handleExport="handleExport"
                 @handleSortChange="handleSortChange"
                 @showModal="showModal"
          ></Table>
        </div>
        <OrgAddModal
          ref="OrgAddModal"
          @afterAdd="afterAdd"
        ></OrgAddModal>
        <RulesModal
          ref="RulesModal"
          :formData="rulesForm"
          @getData="getData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { CUSTOMER_LIST } from '@/static';
import BreadCrumb from '@/components/bread-crumb/index.vue';
import { toRaw } from 'vue';
import AdminApi from '@/server/api/admin';
import RulesModal from '@/views/customer-management/modal/rules-modal.vue';
import $modalConfirm from '@/utils/better-el';
import { dateUtils, fileDownload } from '@/utils';
import CustomerTree from '@/views/customer-management/list/customer-tree.vue';
import Query from '@/views/customer-management/list/query.vue';
import Table from '@/views/customer-management/list/table.vue';
import OrgAddModal from '@/views/customer-management/modal/orgAdd-modal.vue';

export default {
  name: 'customerManagement',
  nameComment: '客户管理',
  components: {
    RulesModal,
    BreadCrumb,
    CustomerTree,
    Query,
    Table,
    OrgAddModal,
  },
  data() {
    return {
      currentQueryParams: {},
      // 搜索条件
      params: {},
      tableData: [],
      title: '全部',
      isActive: 0,
      activities: [], // 域名机构列表
      totalOrgNum: 0, // 总机构数
      totalOperatedOrgNum: 0, // 总合作中机构数
      activeKey: -1,
      editable: false, // 是否可编辑
      customerObj: { // 选中的域名机构详情
        subDomain: '',
        createTime: '',
        topCooperateOrgNum: 0,
        formalOrgNum: 0,
        trialOrgNum: 0,
        domainId: '',
        domainName: '',
      },
      rulesForm: {},
      heightStyle: '89vh',
    };
  },
  created() {
    this.getCuntomerTreeData();
    // 查询机构 使得2查询框默认展示搜索数据
    document.title = '客户管理';
  },
  mounted() {
    // 点击浏览器刷新时，响应 对带参做处理
    this.$nextTick(() => {
      const { id } = this.$route.params;
      const { setOrgId, queryParams } = this.$refs.query;
      if (id && id !== 'all') {
        setOrgId(Number(id));
      }
      this.params = { ...queryParams };
      this.getList();
    });
    // 给机构搜索select框添加最大输入长度
    const dom = document.getElementById('org-select');
    dom.setAttribute('maxLength', 100);
    const that = this;
    window.addEventListener('storage', (e) => {
      if (e.key === 'detailChange' && e.newValue === 'SUCCESS') {
        localStorage.setItem('detailChange', '');
        that.getList();
        if (that.$refs.query) that.$refs.query.getOrgList('');
      }
    });
  },
  watch: {
    $route(to) {
      // 对路由变化作出响应...
      if (to.path === '/login') return;
      const { id } = to.params;
      const { setOrgId, getOrgList, queryParams } = this.$refs.query;
      if (id) {
        if (id !== 'all') {
          setOrgId(Number(id));
        }
      } else {
        setOrgId('');
        this.$refs.CustomerTree.setStatusAll();
      }
      getOrgList('');
      this.params = { ...queryParams };
      this.getList();
    },
    totalOperatedOrgNum(val) {
      if (val && !this.editable) {
        this.title = `全部机构（${this.totalOperatedOrgNum}/${this.totalOrgNum}）`;
      }
    },
  },
  methods: {
    getData() {
      this.getCuntomerTreeData();
      this.getList();
      this.$refs.query.getOrgList('');
    },
    // 获取列表数据
    getList() {
      // 处理搜索条件参数
      // const { queryParams } = this.$refs.query;
      const { page, pageSize, setPageData } = this.$refs.listTable;
      const params = {
        // ...toRaw(type ? this.currentQueryParams : queryParams),
        ...toRaw(this.params),
        page,
        num: pageSize,
      };
      if (params.start) params.start = dateUtils.formatStandardDate(params.start);
      if (params.end) params.end = dateUtils.formatStandardDate(params.end);
      if (params.type === -1) {
        delete params.type;
      }
      this.$refs.listTable.loading = true;
      AdminApi.searchOrg(params)
        .then((res) => {
          const { code, data } = res.data || {};
          if (code === 200) {
            const { list, page: _page, total } = data.result || {};
            // 需要对返回的数据进行空处理，变为"-"
            this.tableData = list.map((item) => {
              const typeName = item.type ? '正式' : '试用';
              const startTime = item.startTime || '-';
              return Object.assign(item, { typeName, startTime });
            });
            setPageData(_page, total);
            this.setTreeMinHeight();
            // 若不是全部机构 则赋值机构详情 customerObj
            const { detail } = data;
            if (detail && Object.keys(detail).length > 0) {
              this.editable = true;
              this.customerObj = Object.assign(this.customerObj, detail);
              this.title = `${detail.domainName}（ID：${detail.domainId}）`;
              this.activeKey = detail.domainId;
            } else {
              this.$nextTick(() => {
                this.title = `全部机构（${this.totalOperatedOrgNum}/${this.totalOrgNum}）`;
                this.editable = false;
              });
            }
          } else {
            this.$message.error('请求出错');
          }
        })
        .finally(() => {
          if (this.$refs.listTable) this.$refs.listTable.loading = false;
        });
    },
    // 获取左侧树 数据
    getCuntomerTreeData(flag = '') {
      AdminApi.orgListDomain().then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const { list, totalOrgNum, totalOperatedOrgNum } = data;
          this.activities = list.map((i) => ({ ...i, showPopover: false }));
          this.totalOrgNum = totalOrgNum;
          this.totalOperatedOrgNum = totalOperatedOrgNum;
          if (flag === 'resetIndex') this.$refs.CustomerTree.resetIndex();
        }
      });
    },
    // 置顶操作 id机构id  flag置顶、取消置顶
    toTopAction(id, flag) {
      const api = flag ? () => AdminApi.resetToTop(id) : () => AdminApi.setToTop(id);
      api().then((res) => {
        const { code, message } = res.data || {};
        if (code === 200) {
          // 刷新左侧树
          this.getCuntomerTreeData('resetIndex');
        } else {
          this.$message.error(message);
        }
      });
    },
    // 排序
    handleSortChange({ prop, order }) {
      const sort = {
        sortColumn: CUSTOMER_LIST[prop],
        sortOrder: CUSTOMER_LIST[order],
      };
      this.params = Object.assign(this.params, sort);
      this.getList();
    },
    pageOrSizeChange() {
      this.getList();
    },
    setTreeMinHeight() {
      this.$nextTick(() => {
        const dom = document.getElementById('main-content-right');
        if (dom && dom.clientHeight) {
          const height = dom.clientHeight >= 772 ? dom.clientHeight : 772;
          this.heightStyle = `${height}px`;
        }
      });
    },
    // 搜索
    handleQuery() {
      const { searchBefore } = this.$refs.listTable;
      searchBefore();
      // 赋值currentQueryParams对象
      const { queryParams } = this.$refs.query;
      this.params = { ...queryParams };
      let url = queryParams.orgId ? `/${queryParams.orgId}` : '/all';
      url = `/customerManagement${url}`;
      if (this.isOrgIdChange(url)) {
        this.$router.push(url);
      } else {
        this.getList();
      }
    },
    // 判断orgId是否变化
    isOrgIdChange(url) {
      const { path } = this.$route;
      return path !== url;
    },
    // 清空搜索条件
    handleClear() {
      const { searchBefore } = this.$refs.listTable;
      searchBefore();
      this.$refs.CustomerTree.handleSelect('all');
      // 赋值currentQueryParams对象
      const { queryParams } = this.$refs.query;
      this.params = { ...queryParams };
    },

    handleExport(type) {
      const { page, multipleSelection } = this.$refs.listTable;
      if (!type && !multipleSelection.length) {
        this.$message.warning('未选中数据');
        return;
      }
      const info = type ? {
        text: '点击确定，将为您导出所有信息',
        title: '确认导出所有信息吗？',
      } : {
        text: '点击确定，将为您导出选中的所有信息',
        title: '确认导出选中的所有信息吗？',
      };
      const params = {
        condition: {
          ...toRaw(this.params),
          page,
        },
        idList: [],
      };
      // 处理查询条件
      if (params.condition.start) params.condition.start = dateUtils.formatStandardDate(params.condition.start);
      if (params.condition.end) params.condition.end = dateUtils.formatStandardDate(params.condition.end);
      if (params.condition.type === -1) {
        delete params.condition.type;
      }
      // 处理选中的id
      params.idList = type ? [] : multipleSelection.map((item) => item.id);
      $modalConfirm(info).then(() => {
        this.$refs.listTable.isChecked = false;
        AdminApi.orgExport(params).then((res) => {
          const { status } = res;
          if (status === 200) {
            fileDownload(res);
          } else {
            this.$message.error('导出失败!');
          }
        });
      }).catch((err) => {
        console.log(err);
      });
    },
    // 打开弹窗 域名机构以及顶级机构创建
    showModal(sign, params = {}) {
      if (sign === 'edit') {
        const { id } = params;
        AdminApi.orgPermission(id).then((res) => {
          const { code, data = {} } = res.data || {};
          if (code === 200) {
            this.$refs.RulesModal.open(data, false);
          } else {
            this.$message.error('请求错误');
          }
        });
      } else if (this.editable) {
        const { domainId, domainName } = this.customerObj;
        AdminApi.getAllPermission().then((res) => {
          const { code, data } = res.data || {};
          const { orgPermissions } = data || {};
          if (code === 200) {
            this.$refs.RulesModal.open({ domainId, domainName, orgPermissions }, true);
          } else {
            this.$message.error('请求错误');
          }
        });
      } else {
        this.$refs.OrgAddModal.addOrgVisible = true;
      }
    },
    // 左侧树点击事件
    customerTreeClick(val, obj) {
      // 改变路由后带参 以便刷新获取id和name做逻辑操作
      let url = '/customerManagement';
      this.$refs.BreadCrumb.editStatus = false;
      const { setOrgId, queryParams } = this.$refs.query;
      if (val && val === 'all') {
        setOrgId('');
        url += '/all';
      } else {
        setOrgId(obj.id);
        url += `/${obj.id}`;
      }
      this.params = { ...queryParams };
      this.$refs.listTable.searchBefore();
      if (this.isOrgIdChange(url)) {
        this.$router.push(url);
      } else {
        this.getList();
      }
    },
    afterAdd() {
      this.getCuntomerTreeData();
      this.$refs.query.getOrgList('');
    },
    // 保存顶级机构名称
    saveName(name) {
      // const { queryParams } = this.$refs.query;
      const params = {
        id: this.customerObj.domainId,
        value: name,
      };
      AdminApi.detailEditName(params).then((res) => {
        const { code, message } = res.data || {};
        if (code === 200) {
          this.$message.success('机构名称修改成功');
          this.$refs.BreadCrumb.editStatus = false;
          // 刷新数据
          this.$refs.query.getOrgList('');
          this.getCuntomerTreeData();
          this.getList();
        } else {
          this.$message.error(message);
        }
      });
    },
  },
};
</script>

<style lang="scss">
.customer-management-container {
  min-width: 1500px;
  background-color: #f0f2f5 !important;
  .query-content {
    background: #fff;
    margin-bottom: 20px;
    border-top: 1px solid #E2E4E9;
  }
  .main-content {
    display: flex;
    margin: 20px;
    &-left {
      min-height: 79vh;
      background: #fff;
      width: 300px;
      min-width: 300px;
      margin-right: 20px;
      padding: 20px 10px 20px 20px;
    }
    &-right {
      flex: 1 !important;
      width: 1px;
      background-color: #fff;
      .customer-detail {
        display: flex;
        justify-content: space-between;
        padding-top: 8px;
        padding-bottom: 16px;
        &-left {
          width: calc(100% - 450px);
          font-size: 14px;
          color: #4E5566;
          .link {
            line-height: 14px;
            a {
              color: #296DD3;
            }
            span:first-child {
              margin-right: 11px;
            }
          }
          .link:last-child {
            margin-top: 16px;
          }
        }
        &-right {
          width: 500px;
          text-align: right;
          .customer {
            display: inline-block;
            text-align: center;
            &-type {
              color: #4E5566;
              font-size: 14px;
              line-height: 14px;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                cursor: pointer;
                margin-right: 5px;
              }
            }
            &-num {
              color: #20242E;
              line-height: 22px;
              font-size: 22px;
              margin-top: 10px;
            }
          }
          .num1 {
            width: 180px;
          }
          .num2 {
            width: 147px;
          }
          .num3 {
            width: 98px;
            text-align: center;
          }
          .divider {
            display: inline-block;
            vertical-align: super;
            width: 1px;
            height: 28px;
            background:#E2E4E9;
          }
        }
      }
      .table-list {
        padding: 20px 20px 40px;
      }
    }
  }
}
.add-org-modal {
  padding-right: 40px;
}
</style>
