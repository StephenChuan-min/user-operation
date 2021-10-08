import {
  defineComponent, getCurrentInstance, reactive, ref,
} from 'vue';
import { dateUtils } from '@/utils';
import monitorApi from '@/server/api/monitor-api';
import rule from './rule';
import './style.scss';

const remarkItemList = ['延期', '续约', '赠送服务', '提前终止'];
export default defineComponent({
  data() {
    return {
      dataForm: {
        id: '',
        endDate: '',
        isLimitedDebtorNums: 0,
        limitedDebtorNums: 0,
        isLimitedSearchNums: 0,
        limitedSearchNums: 0,
        orgName: '',
        remark: '',
        startDate: '',
      },
    };
  },
  emits: ['resetList'],
  setup(props, { emit }) {
    // 区分弹窗
    const { proxy } = getCurrentInstance();
    const modalData = reactive({
      visible: false,
      loading: false,
      domain: '',
      recordData: [],
      debtors: 0,
      useTimes: 0,
    });
    const optionList = ref([]);
    const getDetail = (id) => {
      monitorApi.detail(id).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          const {
            domain, records, ...state
          } = data || {};
          modalData.domain = domain;
          modalData.recordData = records;
          proxy.dataForm = Object.assign(proxy.dataForm, state);
        }
      });
    };
    const resetList = () => {
      emit('resetList');
    };
    const handleOpen = (row) => {
      // 通过id获取详情信息  获取
      const { id, debtors, useTimes } = row;
      modalData.visible = true;
      modalData.debtors = debtors;
      modalData.useTimes = useTimes;
      getDetail(id);
    };
    const handleClick = () => {
      proxy.$refs.dataForm.validate((volid) => {
        if (volid) {
          const params = { ...proxy.dataForm };
          if (!params.remark) {
            proxy.$message.warning('备注不允许为空');
          } else {
            params.startDate = dateUtils.formatStandardDate(params.startDate);
            params.endDate = dateUtils.formatStandardDate(params.endDate);
            params.remark = params.remark.replace(/(\n)+/g, '\n');
            modalData.loading = true;
            monitorApi.save(params).then((res) => {
              const { code } = res.data || {};
              modalData.loading = false;
              if (code === 200) {
                proxy.$message.success('操作成功');
                resetList();
                modalData.visible = false;
              } else {
                proxy.$message.error('请求出错');
              }
            });
          }
        }
      });
    };
    const handleClose = () => {
      proxy.$refs.dataForm.resetFields();
      modalData.visible = false;
    };
    // 日期控件做前后限制
    const disabledStartDate = (startDate) => {
      if (proxy.dataForm.endDate) {
        const time = dateUtils.formatStandardDate(proxy.dataForm.endDate);
        return startDate.getTime() > new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const disabledEndDate = (endDate) => {
      if (proxy.dataForm.startDate) {
        const time = dateUtils.formatStandardDate(proxy.dataForm.startDate);
        return endDate.getTime() < new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const modalSlots = {
      footer: () => <>
        <el-button onClick={ handleClose }>取消</el-button>
        <el-button type="primary" onClick={handleClick} loading={modalData.loading}>确定</el-button>
      </>,
    };
    const addRemark = (text) => {
      const { remark } = proxy.dataForm;
      proxy.dataForm.remark += remark ? `\n${text}` : text;
    };
    const remarkList = <div className="remark-items">
      {
        remarkItemList.map((i) => <div className="item" onClick={() => addRemark(i)}>{i}</div>)
      }
    </div>;
    return {
      modalData,
      optionList,
      handleClose,
      disabledStartDate,
      disabledEndDate,
      modalSlots,
      handleOpen,
      remarkList,
    };
  },
  render() {
    const {
      modalData,
      dataForm,
      handleClose,
      disabledStartDate,
      disabledEndDate,
      modalSlots,
      remarkList,
    } = this;
    return (
      <el-dialog
        title="权限管理"
        v-model={modalData.visible}
        onClosed={handleClose}
        width="600px"
        custom-class="monitor-api-dialog"
        v-slots={modalSlots}
      >
        <el-form
          model={dataForm}
          ref="dataForm"
          rules={rule}
          labelPosition="right"
          class="permission-form"
          labelWidth="166px"
        >
          <el-form-item label="ID：" class="form-text">
            <span>{dataForm.id}</span>
          </el-form-item>
          <el-form-item label="域名名称：" class="form-text">
            <span>{modalData.domain || '-'}</span>
          </el-form-item>
          <el-form-item label="合作机构名称：" prop="orgName">
            <el-input
              v-model={dataForm.orgName}
              placeholder="请输入合作机构名称"
              onBlur={(val) => dataForm.orgName = val.target.value.trim()}
              style={{ width: '402px' }}/>
          </el-form-item>
          <el-form-item label="合同起止日期：" class="form-date">
            <div className="update-time">
              <el-form-item prop="startDate">
                <el-date-picker
                  type="date"
                  placeholder="开始日期"
                  v-model={dataForm.startDate}
                  style="width: 190px"
                  disabledDate={disabledStartDate}
                  append-to-body={false}
                />
              </el-form-item>
              <span className="line" style="margin: 0 4px">至</span>
              <el-form-item prop="endDate">
                <el-date-picker
                  type="date"
                  placeholder="结束日期"
                  v-model={dataForm.endDate}
                  style="width: 190px"
                  disabledDate={disabledEndDate}
                  append-to-body={false}
                />
              </el-form-item>
            </div>
          </el-form-item>
          <el-form-item
            label="限制查询次数："
            prop="isLimitedSearchNums"
            class={dataForm.isLimitedSearchNums === 1 ? '' : 'form-text'}
          >
            <el-col span={10}>
              <el-radio-group size="medium" v-model={dataForm.isLimitedSearchNums}>
                <el-radio label={0}>不限</el-radio>
                <el-radio label={1}>限制</el-radio>
              </el-radio-group>
            </el-col>
            <el-col span={14} v-show={dataForm.isLimitedSearchNums === 1}>
            <el-form-item label="上限：" labelWidth="87px" prop="limitedSearchNums" class="item-in-form">
              <el-input-number
                v-model={dataForm.limitedSearchNums}
                autocomplete="off"
                min={modalData.useTimes}
                max={999999999}
                style={{ width: '180px' }}/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item
            label="限制监控债务人数："
            prop="isLimitedDebtorNums"
            class={dataForm.isLimitedDebtorNums === 1 ? '' : 'form-text'}
          >
            <el-col span={10}>
              <el-radio-group v-model={dataForm.isLimitedDebtorNums} size="medium">
                <el-radio label={0}>不限</el-radio>
                <el-radio label={1}>限制</el-radio>
              </el-radio-group>
            </el-col>
            <el-col span={14} v-show={dataForm.isLimitedDebtorNums === 1}>
              <el-form-item label="上限：" prop="limitedDebtorNums" labelWidth="87px" class="item-in-form">
                <el-input-number
                  v-model={dataForm.limitedDebtorNums}
                  autocomplete="off"
                  min={modalData.debtors}
                  max={999999999}
                  style={{ width: '180px' }}/>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="备注：" prop="remark" class="form-remark">
            <el-input
              v-model={dataForm.remark}
              autosize
              type="textarea"
              style="width: 402px"
              placeholder="请输入备注"
              show-word-limit={true}
              onBlur={(val) => dataForm.remark = val.target.value.trim()}
              maxlength={1000}>
            </el-input>
            {remarkList}
          </el-form-item>
          <el-form-item label="处理记录：" class="form-records">
            {
              modalData.recordData.length
                ? <el-timeline className="record-area">
                  {
                    modalData.recordData.map((i) => <el-timeline-item placement="top" key={i.id} hollow>
                      <div className="record-area-time">{`处理时间：${i.processDate}`}</div>
                      <div className="record-area-cont">{`备注内容：${i.remark}`}</div>
                    </el-timeline-item>)
                  }
                </el-timeline>
                : <div style="line-height: 14px;">-</div>
            }
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
