import {
  defineComponent, getCurrentInstance, reactive, toRaw,
} from 'vue';
import { AUCTION_STATUS, IMPORTANT_TYPE, PUSH_STATUS } from '@/static';
import { dateRange } from '@/utils';

export default defineComponent({
  emits: ['handleSearch'],
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      conSumerName: '', // 客户使用机构
      obName: '', // 债务人
      obNumber: '', // 证件号
      important: '', // 匹配类型 0-模糊匹配、1-精确匹配
      parsingTitle: '', // 标题
      orgName: '', // 负责人/机构名称
      createTimeStart: '', // 匹配开始时间
      createTimeEnd: '', // 匹配结束时间
      pmStatus: '', // 拍卖状态 1:'即将开始', 3:'进行中',5:'已成交',7:'已流拍',9:'中止',11:'撤回'
      status: '', // 状态 0未推送 1已推送 5不推送 2已召回 3已退回 4已修改
      approveTimeStart: '', // 审核开始时间
      approveTimeEnd: '', // 审核结束时间
      updateTimeEnd: '', // 更新结束时间 ,示例值(2021-01-01)
      updateTimeStart: '', // 更新开始时间 ,示例值(2021-01-01)
      start: '',
      isOpen: false,
    });
    const resetForm = () => {
      proxy.$refs.queryForm.resetFields();
    };
    const handleSearch = () => {
      proxy.$emit('handleSearch', toRaw(state));
    };
    return { state, resetForm, handleSearch };
  },
  render() {
    const { state, resetForm, handleSearch } = this;
    return (
      <div className="content-right-query">
        <el-form inline={true} model={state} class="content-right-query-form" ref='queryForm'>
          <div className="line">
            <el-form-item label="客户使用机构：" prop='conSumerName'>
              <el-input
                v-model={state.conSumerName}
                placeholder="客户使用机构名称"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="债务人：" prop='obName'>
              <el-input
                v-model={state.obName}
                placeholder="姓名/公司名称"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="证件号：" prop='obNumber'>
              <el-input
                v-model={state.obNumber}
                placeholder="身份证号/统一社会信用代码"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="匹配类型：" prop='important'>
              <el-select v-model={state.important} placeholder="请选择" style={{ width: '96px' }}>
                {
                  IMPORTANT_TYPE.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                }
              </el-select>
            </el-form-item>
            <el-form-item class="switch" onClick={() => state.isOpen = !state.isOpen}>
              <span v-show={!state.isOpen}>展开选项<i className="el-icon-arrow-down switch-icon" /></span>
              <span v-show={state.isOpen}>收起选项<i className="el-icon-arrow-up switch-icon" /></span>
            </el-form-item>
          </div>
          <div className="line" v-show={state.isOpen}>
            <el-form-item label="标题：" prop='parsingTitle'>
              <el-input
                v-model={state.parsingTitle}
                placeholder="拍卖信息标题"
                style={{ width: '210px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="负责人/机构：" prop='orgName'>
              <el-input
                v-model={state.orgName}
                placeholder="负责人/机构名称"
                style={{ width: '220px' }}
                maxlength="100"
              />
            </el-form-item>
            <el-form-item label="匹配时间：" prop="createTimeStart" style={{ marginRight: 0 }}>
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model={state.createTimeStart}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="至" prop="createTimeEnd" class="time-end">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model={state.createTimeEnd}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="拍卖状态：" prop='pmStatus'>
              <el-select v-model={state.pmStatus} placeholder="请选择" style={{ width: '96px' }}>
                {
                  AUCTION_STATUS.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                }
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop='status'>
              <el-select v-model={state.status} placeholder="请选择" style={{ width: '96px' }}>
                {
                  PUSH_STATUS.map((i) => <el-option key={i.value} label={i.label} value={i.value}></el-option>)
                }
              </el-select>
            </el-form-item>
          </div>
          <div className="line">
            <el-form-item label="审核时间：" prop="approveTimeStart" style={{ marginRight: 0 }}>
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model={state.approveTimeStart}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="至" prop="approveTimeEnd" class="time-end">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model={state.approveTimeEnd}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="开拍时间：" prop="start" class="section-date" >
              <el-date-picker
                v-model={state.start}
                type="daterange"
                unlink-panels
                style={{ width: '260px' }}
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                shortcuts={dateRange()}
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="更新时间：" prop="updateTimeStart" style={{ marginRight: 0 }}>
              <el-date-picker
                type="date"
                placeholder="开始时间"
                v-model={state.updateTimeStart}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item label="至" prop="updateTimeEnd" class="time-end">
              <el-date-picker
                type="date"
                placeholder="结束时间"
                v-model={state.updateTimeEnd}
                style="width: 130px"
              />
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" onClick={handleSearch} class="button-first" style="padding: 8px 21px">搜索</el-button>
              <el-button type="primary" onClick={resetForm} class="button-fourth" style="padding: 8px 11px">清空搜索条件</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    );
  },
});
