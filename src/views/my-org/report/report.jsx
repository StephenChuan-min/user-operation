import {
  reactive, defineComponent, getCurrentInstance,
} from 'vue';
import MyOrgApi from '@/server/api/my-org';
import { dateUtils, fileDownload } from '@/utils';
import './style.scss';

const shortcuts = [{
  text: '最近一天',
  value: (() => {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24);
    return [start, end];
  })(),
}, {
  text: '最近一周',
  value: (() => {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    return [start, end];
  })(),
}, {
  text: '最近一个月',
  value: (() => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 1);
    return [start, end];
  })(),
}];
const reportFormOptions = {
  itemsChecked: [
    {
      title: '资产挖掘',
      key: 'zcwj',
      children: [
        {
          label: '资产拍卖',
          val: '1',
        },
        {
          label: '土地信息',
          val: '2',
        },
        {
          label: '无形资产',
          val: '3',
        },
        {
          label: '代位权',
          val: '4',
        },
        {
          label: '股权质押',
          val: '5',
        },
        {
          label: '动产抵押',
          val: '6',
        },
        {
          label: '查解封资产',
          val: '7',
        },
        {
          label: '在建工程',
          val: '8',
        },
        {
          label: '不动产登记',
          val: '9',
        },
        {
          label: '车辆信息',
          val: '10',
        },
        {
          label: '金融资产',
          val: '11',
        },
        {
          label: '招投标',
          val: '12',
        },
        {
          label: '电子报',
          val: '18',
        },
      ],
    },
    {
      title: '风险参考',
      key: 'fxck',
      children: [
        {
          label: '破案重组',
          val: '13',
        },
        {
          label: '被执行信息',
          val: '19',
        },
        {
          label: '终本案件',
          val: '20',
        },
        {
          label: '失信记录',
          val: '14',
        },
        {
          label: '限制高消费',
          val: '15',
        },
        {
          label: '涉诉信息',
          val: '16',
        },
        {
          label: '经营风险',
          val: '17',
        },
      ],
    },
  ],
};

export default defineComponent({
  data() {
    return {
      reportForm: {
        time: '',
      },
    };
  },
  setup() {
    const { proxy } = getCurrentInstance();
    const checkList = reactive({
      zcwj: {
        checkAll: true,
        checkedData: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '18'],
        isIndeterminate: false,
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '18'],
      },
      fxck: {
        checkAll: true,
        checkedData: ['13', '14', '15', '16', '17', '19', '20'],
        isIndeterminate: false,
        options: ['13', '14', '15', '16', '17', '19', '20'],
      },
    });

    const timeChange = (val) => {
      console.log(val, proxy.reportForm.time, '3');
    };
    const report = reactive({
      reportVisible: false,
      orgId: 0,
      title: '',
    });
    const msg = reactive({
      buttonLoading: false,
    });

    const open = ({ id, name = '' }) => {
      report.reportVisible = true;
      report.orgId = id;
      report.title = `客户报告-${name}`;
    };
    const close = () => {
      proxy.$refs.reportForm.resetFields();
      proxy.reportForm.time = '';
      report.reportVisible = false;
      if (msg.buttonLoading) msg.buttonLoading = false;
    };

    // 权限模块-全选
    const handleCheckAllChange = (val, key) => {
      checkList[key].checkedData = val ? checkList[key].options : [];
      checkList[key].isIndeterminate = false;
    };
    // 权限模块-单选
    const handleCheckedItemChange = (val, key) => {
      const count = val.length;
      checkList[key].checkAll = count === checkList[key].options.length;
      checkList[key].isIndeterminate = count > 0 && count < checkList[key].options.length;
    };

    // 点击确定
    const handlereport = () => {
      proxy.$refs.reportForm.validate((valid) => {
        if (valid) {
          const params = {
            start: dateUtils.formatStandardDate(proxy.reportForm.time[0]),
            end: dateUtils.formatStandardDate(proxy.reportForm.time[1]),
            id: report.orgId,
          };
          const modalMsg = proxy.$message.warning({
            message: '正在下载，请稍等...',
            duration: 1000,
          });
          msg.buttonLoading = true;
          MyOrgApi.exportOther(params).then((res) => {
            msg.buttonLoading = false;
            const { code = 200, message = '导出失败' } = res.data || {};
            if (code === 200) {
              fileDownload(res);
              report.reportVisible = false;
            } else {
              proxy.$message.error(message);
            }
          }, () => {
            msg.buttonLoading = false;
            modalMsg.close();
          });
        }
      });
    };
    const modalSlots = {
      title: null,
      footer: () => <>
        <el-button onClick={ close }>取消</el-button>
        <el-button type="primary" onClick={handlereport} loading={msg.buttonLoading}>确定</el-button>
      </>,
    };

    return {
      checkList,
      report,
      open,
      close,
      timeChange,
      handleCheckAllChange,
      handleCheckedItemChange,
      handlereport,
      modalSlots,
      msg,
    };
  },
  render() {
    const {
      checkList,
      reportForm,
      report,
      timeChange,
      close,
      modalSlots,
      handleCheckAllChange,
      handleCheckedItemChange,
    } = this;
    const { title, reportVisible = false } = report;
    return (
      <el-dialog
        title={title}
        v-model={reportVisible}
        onClosed={ close }
        width="638px"
        destroy-on-close
        v-slots={modalSlots}
      >
        <el-form
          model={reportForm}
          ref="reportForm"
          labelPosition="right"
          labelWidth="138px"
          class="report-modal-form"
        >
          <el-form-item label="更新时间：" prop="time" rules={[{ required: true, message: '请选择更新时间', trigger: 'change' }]}>
            <el-date-picker
              style={{ width: '468px' }}
              v-model={reportForm.time}
              class="report-date"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              onChange={timeChange}
              shortcuts={shortcuts}
            />
            </el-form-item>
          <el-form-item label="全部数据类型：" rules={[{ required: true }]}>
          <div className="zcjk-rules-box">
            {
              reportFormOptions.itemsChecked.map((item) => (
                <div
                  className="zcjk-rules-box-item"
                  key={item.title}
                >
                  <el-checkbox
                    class="zcjk-rules-box-item-moduleType"
                    disabled
                    indeterminate={checkList[item.key].isIndeterminate}
                    v-model={checkList[item.key].checkAll}
                    onChange={(val) => handleCheckAllChange(val, item.key)}
                    >{ item.title }</el-checkbox
                  >
                  <el-checkbox-group
                    class="zcjk-rules-box-item-moduleList"
                    v-model={checkList[item.key].checkedData}
                    onChange={(val) => handleCheckedItemChange(val, item.key)}
                  >
                    {
                      item.children.map((child) => (
                        <el-checkbox
                          label={child.val}
                          disabled
                          key={child.val}
                          >{ child.label }
                        </el-checkbox>
                      ))
                    }
                  </el-checkbox-group>
                </div>
              ))
            }
          </div>
        </el-form-item>
        </el-form>
      </el-dialog>
    );
  },
});
