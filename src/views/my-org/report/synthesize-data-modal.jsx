import {
  defineComponent, getCurrentInstance, reactive, ref,
} from 'vue';
import { dateUtils } from '@/utils';
import main from './main';
import './style.scss';

export default defineComponent({
  data() {
    return {
      dataForm: {
        startTime: undefined,
        endTime: undefined,
        end: undefined,
      },
    };
  },
  setup() {
    // 区分弹窗
    const isData = ref(true);
    const { proxy } = getCurrentInstance();
    const rule = main();
    const modalData = reactive({
      visible: false,
      loading: false,
      orgId: '',
    });
    const optionList = ref([]);
    const handleOpen = (flag) => {
      isData.value = flag === 'data';
      // const { id } = row;
      modalData.visible = true;
      // 通过id获取机构列表
    };
    const handleClick = () => {
      proxy.$refs.dataForm.validate((volid) => {
        if (volid) {
          modalData.visible = false;
        }
      });
    };
    const handleClose = () => {
      proxy.$refs.dataForm.resetFields();
      modalData.visible = false;
    };
    // 日期控件做前后限制
    const disabledStartDate = (startTime) => {
      if (proxy.dataForm.endTime) {
        const time = dateUtils.formatStandardDate(proxy.dataForm.endTime);
        return startTime.getTime() > new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const disabledEndDate = (endTime) => {
      if (proxy.dataForm.startTime) {
        const time = dateUtils.formatStandardDate(proxy.dataForm.startTime);
        return endTime.getTime() < new Date(`${time} 00:00:00`).getTime();
      }
      return false;
    };
    const modalSlots = {
      footer: () => <>
        <el-button onClick={ handleClose }>取消</el-button>
        <el-button type="primary" onClick={handleClick} loading={modalData.loading}>确定</el-button>
      </>,
    };
    return {
      isData,
      modalData,
      optionList,
      handleClose,
      disabledStartDate,
      disabledEndDate,
      modalSlots,
      handleOpen,
      rule,
    };
  },
  render() {
    const {
      isData,
      modalData,
      optionList,
      dataForm,
      handleClose,
      disabledStartDate,
      disabledEndDate,
      modalSlots,
      rule,
    } = this;
    const Title = isData ? '综合数据导出' : '账号使用情况导出';
    return (
      <el-dialog
        title={Title}
        v-model={modalData.visible}
        onClosed={handleClose}
        width="500px"
        v-slots={modalSlots}
      >
        <el-form
          model={dataForm}
          ref="dataForm"
          rules={rule}
          labelPosition="right"
          labelWidth="118px"
          className="data-modal-form"
        >
          <el-form-item label="机构名称：" prop="org">
            <el-select style="width: 342px">
              {optionList.map((i) => (
                <el-option key={i.id}>{i.name}</el-option>
              ))}
            </el-select>
          </el-form-item>
            <el-form-item label="更新时间：" v-show={isData}>
              <div className="update-time">
                <el-form-item prop="startTime">
                  <el-date-picker
                    type="date"
                    placeholder="开始时间"
                    v-model={dataForm.startTime}
                    style="width: 158px"
                    disabledDate={disabledStartDate}
                    append-to-body={false}
                  />
                </el-form-item>
                <span className="line" style="margin: 0 6px">至</span>
                <el-form-item prop="endTime">
                  <el-date-picker
                    type="date"
                    placeholder="结束时间"
                    v-model={dataForm.endTime}
                    style="width: 158px"
                    disabledDate={disabledEndDate}
                    append-to-body={false}
                  />
                </el-form-item>
              </div>
            </el-form-item>
          <el-form-item label="截止日期：" prop="end" v-show={!isData}>
            <el-date-picker
              type="date"
              placeholder="截止日期"
              v-model={dataForm.end}
              style="width: 342px"
              append-to-body={false}
            />
          </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
