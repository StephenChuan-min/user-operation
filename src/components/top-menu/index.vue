<template>
  <div class="yc-header-container">
    <div class="title">
      <img :src="logo" alt="" />
      <span>源诚用户运营平台</span>
    </div>
    <div class="user-message">
      <el-dropdown trigger="click" @visible-change="handleToggle" class="user-message-dropdown">
        <span class="el-dropdown-link">
          hi，{{ name }}
          <i class="el-icon-caret-top" v-if="iconToggle"></i>
          <i class="el-icon-caret-bottom" v-else></i>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="visible = true">
              <span class="iconfont iconxiugaimima"></span>
              修改密码
            </el-dropdown-item>
            <el-dropdown-item @click="loginOut">
              <span class="iconfont icontuichudenglu1"></span>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <el-dialog
      title="修改密码"
      v-model="visible"
      @close="resetForm"
      width="500px"
      custom-class="change-pwd-modal"
    >
      <el-form
        :model="form"
        ref="editPwdForm"
        v-bind="formOptions.options"
        :rules="formOptions.rules"
      >
        <el-form-item label="原密码：" prop="oldPassword">
          <el-input
            v-model="form.oldPassword"
            autocomplete="off"
            maxlength="20"
            placeholder="请输入原密码"
            @change="
              (value) => (form.oldPassword = value.replace(/[\W_]/g, ''))
            "
            show-password
            class="passward-item"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            autocomplete="off"
            maxlength="20"
            @change="
              (value) => (form.newPassword = value.replace(/[\W_]/g, ''))
            "
            placeholder="请输入新密码"
            show-password
            class="passward-item"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="确认新密码："
          prop="confirmPassword"
          class="confirm-pwd"
        >
          <el-input
            v-model="form.confirmPassword"
            autocomplete="off"
            maxlength="20"
            placeholder="请再次输入新密码"
            @change="
              (value) => (form.confirmPassword = value.replace(/[\W_]/g, ''))
            "
            show-password
            class="passward-item"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import logoImg from '@/assets/img/top_logo.png';
import { encryptEditPwd } from '@/utils/encrypt';
import { toRaw } from 'vue';
import LoginApi from '@/server/api/login';
import $modalConfirm from '@/utils/better-el';

export default {
  name: 'index',
  nameComment: '顶部导航栏',
  data() {
    const validateOld = (rule, value, callback) => {
      if (this.form.newPassword !== '') {
        this.$refs.editPwdForm.validateField('newPassword');
      }
      callback();
    };
    const validateNew = (rule, value, callback) => {
      if (value === this.form.oldPassword) {
        callback(new Error('新密码不能与原密码一致'));
      }
      if (this.form.confirmPassword !== '') {
        this.$refs.editPwdForm.validateField('confirmPassword');
      }
      callback();
    };
    const validateConfirm = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error('密码不一致'));
      } else {
        callback();
      }
    };
    return {
      logo: logoImg,
      visible: false,
      iconToggle: false,
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      formOptions: {
        options: {
          labelPosition: 'right',
          labelWidth: '146px',
          destroyOnClose: true,
        },
        rules: {
          oldPassword: [
            { required: true, message: '请输入原密码', trigger: 'change' },
            { validator: validateOld, trigger: 'blur' },
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '密码小于6位', trigger: ['blur', 'change'] },
            { validator: validateNew, trigger: 'blur' },
          ],
          confirmPassword: [{ validator: validateConfirm, trigger: 'change' }],
        },
      },
    };
  },
  props: {
    name: {
      type: String,
      default: '',
    },
  },
  methods: {
    onSubmit() {
      this.$refs.editPwdForm.validate((valid) => {
        if (valid) {
          const { oldPassword, newPassword } = encryptEditPwd(toRaw(this.form));
          LoginApi.editPassword({ oldPassword, newPassword }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success({
                message: '密码修改成功',
                onClose: () => {
                  localStorage.clear();
                  this.$router.push('/login');
                  this.visible = false;
                },
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    },
    resetForm() {
      this.$refs.editPwdForm.resetFields();
    },
    loginOut() {
      $modalConfirm({ title: '确认要退出登录吗?' })
        .then(() => {
          LoginApi.loginOut();
          this.$router.push('/login');
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleToggle(val) {
      this.iconToggle = val;
    },
  },
};
</script>

<style lang="scss">
.el-header {
  padding: 0;
}

.yc-header-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .title {
    display: flex;
    align-items: center;
    height: 100%;
    background-color: #132032;
    padding-left: 20px;
    width: 220px;
    box-sizing: border-box;
    span {
      font-size: 16px;
      margin-left: 6px;
      font-weight: 700;
    }
  }

  .user-message {
    .el-dropdown {
      cursor: pointer;
      &:hover {
        color: #296dd3;
      }

      .el-dropdown-selfdefine {
        display: flex;
        min-width: 80px;
        padding: 0 20px;
        height: 50px;
        align-items: center;
        justify-content: center;
      }
    }
    &-dropdown {
      top: 0 !important;
      left: unset !important;
      right: 0 !important;
      min-width: 117px;
      border-radius: 0;

      .el-dropdown-menu {
        padding: 0;
        &__item {
          height: 39px;
          line-height: 39px;
          span {
            position: relative;
            top: 1px;
          }
        }
      }

      .el-popper__arrow::before {
        content: none;
      }
    }
  }
}

.change-pwd-modal {
  .el-form {
    padding-right: 54px;
    &-item {
      margin-bottom: 16px !important;
      &:last-child {
        margin-bottom: 36px !important;
      }
    }
    .confirm-pwd {
      .el-form-item__label {
        &::before {
          content: "*";
          color: #f93535;
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
