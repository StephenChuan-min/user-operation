<template>
  <el-dialog
    :title="isAdd ? '创建顶级合作机构' : '权限管理'"
    v-model="visible"
    width="712px"
    @close="close"
    custom-class="rules-modal"
    destroy-on-close
  >
    <el-form
      :model="rulesForm"
      ref="rulesForm"
      v-bind="rulesFormOptions.options"
      :rules="rulesFormOptions.rules"
    >
      <el-form-item label="ID：" v-if="!isAdd" style="margin: -8px 0 10px">
        <div>
          {{ $filters.undefinedShow(rulesForm.id) }}
        </div>
      </el-form-item>
      <el-form-item
        label="顶级合作机构名称："
        prop="name"
        style="margin-bottom: 11px"
      >
        <el-input
          v-model="rulesForm.name"
          autocomplete="off"
          maxlength="100"
          placeholder="请输入机构名称"
          style="width: 514px"
          @blur="handleNameBlur"
        />
      </el-form-item>
      <el-form-item label="机构类型：" prop="type" style="margin-bottom: 11px">
        <el-radio-group v-model="rulesForm.type" size="medium">
          <el-radio :label="0" :disabled="!isAdd && disabledType === 1"
            >试用</el-radio
          >
          <el-radio :label="1">正式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="合同起止日期：" :style="{ marginBottom: isContractTypeDisplay||isAdd ? '11px' : '20px' }" required>
        <el-col :span="12">
          <el-form-item prop="start">
            <el-date-picker
              type="date"
              placeholder="开始日期"
              v-model="rulesForm.start"
              style="width: 242px"
              :disabledDate="disabledStartDate"
              popper-class="data-picker"
              :append-to-body="false"
            />
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2" style="margin: 0 8px">至</el-col>
        <el-col :span="11">
          <el-form-item prop="end">
            <el-date-picker
              type="date"
              placeholder="结束日期"
              v-model="rulesForm.end"
              style="width: 242px"
              :disabledDate="disabledEndDate"
              popper-class="data-picker"
              :append-to-body="false"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item
        label="是否延期或续签："
        v-if="isContractTypeDisplay"
        prop="contractType"
        style="margin-bottom: 11px"
      >
        <el-radio-group v-model="rulesForm.contractType" size="medium">
          <el-radio :label="2">延期</el-radio>
          <el-radio :label="1">签约</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="上级机构ID："
        :prop="isAdd ? '' : 'parentId'"
        :style="{ margin: isAdd ? 0 : '10px 0 20px' }"
      >
        <el-select
          v-model="rulesForm.parentId"
          placeholder="请选择上级机构ID"
          v-if="!isAdd"
          filterable
          style="width: 514px"
        >
          <el-option
            v-for="item in parentOrg"
            :label="item.id"
            :value="item.id"
            :key="item.id"
          />
        </el-select>
        <span v-else>{{ $filters.undefinedShow(rulesForm.parentId) }}</span>
      </el-form-item>
      <el-form-item
        label="上级机构名称："
        :prop="isAdd ? '' : 'parentName'"
        :style="{ marginBottom: isAdd ? 0 : '10px' }"
      >
        <el-input
          v-if="!isAdd"
          :modelValue="dynamicParentName"
          autocomplete="off"
          maxlength="11"
          :disabled="true"
          placeholder="请输入上级机构名称"
          style="width: 514px"
        />
        <span v-else>{{ $filters.undefinedShow(rulesForm.parentName) }}</span>
      </el-form-item>
      <el-form-item
        v-for="item in rulesFormOptions.itemsRaido"
        :label="`${item.label}：`"
        :key="item.val"
        :prop="item.val"
        :style="{ marginBottom: rulesForm[item.val] ? '14px' : 0 }"
        class="radio-item"
      >
        <el-col :span="10">
          <el-radio-group v-model="rulesForm[item.val]" size="medium">
            <el-radio :label="0">不限</el-radio>
            <el-radio :label="1" :disabled="item.val === 'isClassifiedLimit'"
              >限制</el-radio
            >
          </el-radio-group>
        </el-col>
        <el-col :span="14" style="float: right;">
          <el-form-item
            label="上限："
            label-width="70px"
            :prop="item.num || ''"
            v-if="rulesForm[item.val] === 1"
          >
            <el-input-number
              v-model="rulesForm[item.num]"
              autocomplete="off"
              :min="rulesForm[item.limit] || 0"
              :max="999999999"
              style="width: 216px"
            />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="资产监控权限：" style="margin-top: 11px">
        <div class="zcjk-rules-box">
          <div
            class="zcjk-rules-box-item"
            v-for="item in itemsChecked"
            :key="item.title"
          >
            <el-checkbox
              class="zcjk-rules-box-item-moduleType"
              :indeterminate="checkList[item.key].isIndeterminate"
              v-model="checkList[item.key].checkAll"
              @change="(val) => handleCheckAllChange(val, item.key)"
              >{{ item.title }}</el-checkbox
            >
            <el-checkbox-group
              class="zcjk-rules-box-item-moduleList"
              v-model="checkList[item.key].checkedData"
              @change="(val) => handleCheckedItemChange(val, item.key)"
            >
              <el-checkbox
                v-for="child in item.children"
                :label="child.id"
                :key="child.id"
                >{{ child.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="onsubmit">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import AdminApi from '@/server/api/admin';
import {
  dateUtils, handlePermissions, getCheckedList, getPermissionsList,
} from '@/utils';
import { rulesFormOptions, rulesForm } from './data';

export default {
  name: 'rules-modal',
  nameComment: '客户管理-权限管理弹窗',
  emits: ['getData'],
  props: {
    formData: {
      type: Object,
      default: () => {},
    },
  },
  watch: {},
  data() {
    return {
      visible: false,
      isAdd: false,
      disabledType: '',
      endTime: '',
      parentOrg: [],
      rulesForm,
      checkList: {},
      rulesFormOptions,
      itemsChecked: [],
    };
  },

  methods: {
    // 弹窗打开
    open(params = {}, isAdd) {
      this.visible = true;
      if (isAdd) {
        const { domainId, domainName, orgPermissions } = params;
        this.rulesForm = {
          ...this.rulesForm,
          parentId: domainId,
          parentName: domainName,
        };
        this.getCheckList(handlePermissions(orgPermissions));
      } else {
        const { permissions = [], ...rest } = params;
        const {
          id, type, end, start,
        } = rest;
        this.getCheckList(permissions);
        this.disabledType = type;
        this.endTime = end;
        this.rulesForm = {
          ...rest,
          start: start ? new Date(start) : '',
          end: new Date(end),
        };
        AdminApi.selectParentOrgList(id).then((res) => {
          const { code, data = [] } = res.data || {};
          if (code === 200) {
            this.parentOrg = data;
          } else {
            this.$message.error('请求错误');
          }
        });
      }
      this.isAdd = isAdd;
    },
    // 弹窗关闭
    close() {
      this.$refs.rulesForm.resetFields();
      this.rulesForm = rulesForm;
    },
    // 提交
    onsubmit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          const selectedIds = this.getPermission();
          const time = (val) => dateUtils.formatStandardDate(val);
          const {
            end,
            start,
            isPortraitLimit,
            isObligorLimit,
            isSubOrgLimit,
            isAccountLimit,
            portraitLimitCount,
            obligorLimitCount,
            subOrgLimitCount,
            accountLimitCount,
          } = this.rulesForm;
          const params = {
            ...this.rulesForm,
            selectedIds,
            end: time(end),
            start: time(start),
            portraitLimitCount: isPortraitLimit ? portraitLimitCount : 0,
            obligorLimitCount: isObligorLimit ? obligorLimitCount : 0,
            subOrgLimitCount: isSubOrgLimit ? subOrgLimitCount : 0,
            accountLimitCount: isAccountLimit ? accountLimitCount : 0,
          };
          const sign = this.isAdd ? 'add' : 'edit';
          const text = this.isAdd ? '顶级合作机构创建成功' : '修改成功';
          AdminApi.addAndEditRules(params, sign).then((res) => {
            const { code, message } = res.data || {};
            if (code === 200) {
              this.$message.success({
                message: text,
                onClose: () => {
                  this.visible = false;
                  this.$emit('getData');
                },
              });
            } else {
              this.$message.error(message);
            }
          });
        }
      });
    },

    // 提交时处理 权限数组
    getPermission() {
      let arr = [];
      Object.keys(this.checkList).forEach((key) => {
        const data = this.checkList[key].checkedData;
        arr = [...arr, ...data];
      });
      return arr;
    },
    // 回显时处理 权限数组
    getCheckList(permissions = []) {
      const arr = getCheckedList(permissions);
      this.itemsChecked = arr;
      this.checkList = getPermissionsList(arr);
    },

    // 权限模块-全选
    handleCheckAllChange(val, key) {
      this.checkList[key].checkedData = val ? this.checkList[key].options : [];
      this.checkList[key].isIndeterminate = false;
    },
    // 权限模块-单选
    handleCheckedItemChange(val, key) {
      const count = val.length;
      this.checkList[key].checkAll = count === this.checkList[key].options.length;
      this.checkList[key].isIndeterminate = count > 0 && count < this.checkList[key].options.length;
    },
    // 姓名失焦去除所有空格
    handleNameBlur() {
      const { name } = this.rulesForm;
      this.rulesForm.name = name.replace(/\s+/g, '');
    },
    // 时间控件做前后限制
    disabledStartDate(startTime) {
      const endTime = this.rulesForm.end;
      if (!startTime || !endTime) return false;
      const dynamicEndTime = new Date(endTime).valueOf();
      return startTime.valueOf() > dynamicEndTime;
    },
    disabledEndDate(endTime) {
      const { start } = this.rulesForm;
      const dateFn = (i) => new Date(i).valueOf() || 0;
      const maxTime = Math.max(dateFn(start), dateFn(this.endTime));
      const startTime = this.isAdd ? dateFn(start) : maxTime;
      if (!endTime || !startTime) return false;
      const dynamicTime = startTime - 86400000;
      return endTime.valueOf() <= dynamicTime;
    },
  },
  computed: {
    // 上级机构名称(随上级机构Id联动)
    dynamicParentName() {
      const { parentId } = this.rulesForm;
      return ((this.parentOrg || []).filter((i) => i.id === parentId)[0] || {})
        .value;
    },
    // 是否延期或续签 (随合同结束日期 || 机构类型 联动)
    isContractTypeDisplay() {
      const isOvertime = new Date(this.rulesForm.end).valueOf()
        > new Date(this.endTime).valueOf();
      return !this.isAdd && isOvertime && this.disabledType === 1;
    },
  },
};
</script>

<style lang="scss">
.rules-modal {
  margin-top: 5vh !important;
  .el-dialog__body{
    height: 720px;
    overflow: auto;
    position: relative;
    //滚动条的宽度
    &::-webkit-scrollbar {
      width:4px;
    }

    //外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果
    &::-webkit-scrollbar-track {
      width: 4px;
      background-color:#FFF;
    }

    //滚动条的设置
    &::-webkit-scrollbar-thumb {
      background-color:#B2B8C9;
      background-clip:padding-box;
      min-height:49px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius:5px;
    }
    //滚动条移上去的背景

    &::-webkit-scrollbar-thumb:hover{
      background-color:#B2B8C9;
    }
    &::-webkit-scrollbar-track:hover{
      background-color:#E2E4E9;
    }
  }

  &-form {
    padding-right: 28px;
    .el-form-item {
      &__content {
        line-height: 32px !important;
        .el-date-editor{
          .el-input__inner{
            padding: 0 30px 0 30px ;
          }
        }
        .el-input__inner{
          padding: 0 30px 0 12px ;
        }
      }
      &__label {
        line-height: 32px !important;
      }
    }
    .radio-item{
      .el-form-item__content{
        .el-form-item{
          &__error{
            left: 60px ;
          }
        }
      }
    }
    .zcjk-rules-box {
      padding: 5px 0 16px 16px;
      border-radius: 2px;
      border: 1px solid #c5c7ce;
      &-item {
        line-height: 20px !important;
        &-moduleType {
          font-weight: bold;
          margin: 8px 0;
          .el-checkbox__label{
              color: #20242E!important;
          }
        }
        .el-checkbox {
          min-width: 118px;
          line-height: 20px !important;
          margin-right: 0;
          &__label {
            padding-left: 8px;
          }
        }
        &-moduleList {
          padding-left: 22px;
          .el-checkbox__label{
            color: #4E5566!important;
          }
        }
      }
    }
  }
  .el-dialog__body {
    padding-top: 24px !important;
    position: relative;
  }
}
.data-picker{
  //z-index: 2010 !important;
}
</style>
