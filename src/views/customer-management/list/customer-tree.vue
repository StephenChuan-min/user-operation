<template>
  <div class="customer-tree" id="customerTree" :style="'max-height:' + heightStyle">
    <div class="customer-tree-title">
      <svg class="icon" aria-hidden="true" style="font-size: 20px;">
        <use xlink:href="#iconyonghuyunying-quanbushiyongjigou"></use>
      </svg>
      <span
        class="titleText"
        :class="{ active: selectAll }"
        @click="handleSelect('all')"
        >{{`全部机构（${totalOperatedOrgNum}/${totalOrgNum}）`}}</span
      >
      <el-tooltip
        class="item"
        effect="dark"
        content="合作中机构数/总机构数"
        placement="top"
      >
        <img src="../../../assets/img/icon.png" style="vertical-align: bottom;margin-left:2px;"/>
      </el-tooltip>
    </div>
    <div class="customer-tree-content">
      <div
        v-for="(item, index) in showList"
        :key="item.id"
        class="customer-tree-content-item"
        @click.right="() => showPopover(index)"
      >
        <span :class="{ active: isActive === index, isTop: item.sortOrder >= 1 }" class="itemText" @click="handleSelect('item', index, item)">
          <div class="itemText-ellipsis">
            <el-tooltip
              effect="dark"
              :content="item.name"
              placement="top"
              v-if="item.name.length >= 17"
            >
              <span>{{item.name}}</span>
            </el-tooltip>
            <span v-else>{{item.name}}</span>
          </div>
          {{setText(item)}}
          <el-popover
            placement="right"
            trigger="click"
            popper-class="tree-popover"
            :visible="item.showPopover"
          >
            <template #reference>
              <span style="width: 1px;height: 32px;"></span>
            </template>
            <div class="popover-area" @click="handleActionToTop(item, item.sortOrder >= 1)">
              <i :class="`iconfont ${item.sortOrder >= 1 ? 'iconquxiaozhiding' : 'iconzhiding'} zhiding`"></i>
              {{item.sortOrder >= 1 ? '取消置顶' : '机构置顶'}}
            </div>
          </el-popover>
        </span>
        <!-- 横线 -->
        <div
          class="itemS"
          :style="isActive === index ? 'background: #296DD3' : ''"
        ></div>
        <!-- 竖线 -->
        <div
          class="itemV"
          :style="index ? '' : 'height: 18px;top:0px;'"
        ></div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'CustomerTree',
  props: {
    activities: {
      type: Array,
      default: () => [],
    },
    totalOrgNum: { // 总机构数
      type: Number,
      default: 0,
    },
    totalOperatedOrgNum: { // 总合作中机构数
      type: Number,
      default: 0,
    },
    activeKey: {
      type: Number,
      default: -1,
    },
    heightStyle: {
      type: String,
      default: '',
    },
  },
  watch: {
    activeKey(newVal) {
      if (newVal) {
        this.activities.forEach((item, index) => {
          if (item.id === Number(newVal)) {
            this.isActive = index;
          }
        });
        this.selectAll = false;
        this.$nextTick(() => {
          // 若是选中的机构没有在视线之内，手动调整滚动条展示
          const dom = document.getElementById('customerTree');
          if (dom && dom.clientHeight > 41) {
            // 若是树的总高度不高于容器，则不做任何处理  clientHeight   scrollTop
            const domHeight = dom.clientHeight;
            const scrollHeight = dom.scrollTop;
            const itemClientHeight = 20 + 34 * (this.isActive + 1);
            if ((itemClientHeight < scrollHeight) || (itemClientHeight > (domHeight + scrollHeight))) {
              dom.scrollTop = itemClientHeight - 50;
            }
          }
        });
      }
    },
  },
  data() {
    return {
      selectAll: true,
      isActive: -1,
      show1: false,
    };
  },
  computed: {
    showList() {
      return this.activities;
    },
  },
  mounted() {
    // 取消树区域的默认浏览器右键事件
    document.getElementById('customerTree').oncontextmenu = function () {
      return false;
    };
    // 处理 点击树以外的地方就将置顶弹窗收起
    document.addEventListener('click', (e) => this.handleClosePopover(e));
  },
  beforeUnmount() {
    document.removeEventListener('click', (e) => this.handleClosePopover(e));
  },
  methods: {
    handleClosePopover(e) {
      const dom = document.getElementById('customerTree');
      if (dom) {
        if (!dom.contains(e.target)) {
          this.closePopover();
        }
      }
    },
    // 设置文字+数字
    setText(item) {
      return `(${item.operatedOrgNum}/${item.orgNum})`;
    },
    setStatusAll() {
      this.selectAll = true;
      this.isActive = -1;
      const dom = document.getElementById('customerTree');
      dom.scrollTop = 0;
    },
    resetIndex() {
      this.$nextTick(() => {
        this.activities.forEach((item, index) => {
          if (item.id === Number(this.activeKey)) {
            this.isActive = index;
          }
        });
      });
    },
    // 点击选中某一项
    handleSelect(val, index, item) {
      this.closePopover();
      if (val === 'all') {
        this.selectAll = true;
        this.isActive = -1;
        const dom = document.getElementById('customerTree');
        dom.scrollTop = 0;
        this.$emit('handleClick', 'all', {});
      } else {
        this.selectAll = false;
        this.isActive = index;
        this.$emit('handleClick', '', item);
      }
    },
    // 关闭置顶浮窗
    closePopover() {
      this.showList.forEach((item, index) => {
        if (item.showPopover) this.showList[index].showPopover = false;
      });
    },
    // 显示置顶浮窗
    showPopover(index) {
      this.closePopover();
      this.showList[index].showPopover = true;
    },
    // 点击操作调接口
    handleActionToTop(item, flag) {
      this.closePopover();
      const { id } = item;
      this.$emit('toTopAction', id, flag);
    },
  },
};
</script>
<style lang="scss" scoped>
.customer-tree {
  width: 100%;
  overflow-y: auto;
  &-title {
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;
    font-weight: 600;
    .titleText {
      color: #20242e;
      margin-left: 6px;
    }
    .active {
      color: #296dd3;
    }
  }
  &-content {
    font-size: 14px;
    // line-height: 14px;
    cursor: pointer;
    margin-top: 10px;
    color: #20242e;
    &-item {
      position: relative;
      height: 34px;
      line-height: 34px;
      padding-left: 16px;
      .itemText {
        display: block;
        padding-left: 10px;
        &-ellipsis {
          display: inline-block;
          max-width: 213px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          vertical-align: top;
          position: relative;
          .item-rightClick {
            height: 34px;
            width: 100px;
          }
        }
      }
      .itemText:hover {
        background-color: #EEF1F7;
      }
      .active {
        color: #296dd3;
        font-weight: bold;
      }
      .isTop {
        background-color: #EEF1F7;
      }
      .itemS {
        position: absolute;
        background: #c5c7ce;
        width: 8px;
        height: 1px;
        top: 16px;
        left: 8px;
      }
      .activeS {
        background: #296dd3;
      }
      .itemV {
        position: absolute;
        background: #c5c7ce;
        width: 1px;
        height: 39px;
        top: -22px;
        left: 7px;
      }
    }
    &-item:first-child {
      margin-top: 0;
    }
  }
}
//滚动条的宽度
.customer-tree::-webkit-scrollbar {
  width:4px;
}

//外层轨道。可以用display:none让其不显示，也可以添加背景图片，颜色改变显示效果
.customer-tree::-webkit-scrollbar-track {
  width: 4px;
  background-color:#FFF;
}

//滚动条的设置
.customer-tree::-webkit-scrollbar-thumb {
  background-color:#B2B8C9;
  background-clip:padding-box;
  min-height:49px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius:5px;
}
//滚动条移上去的背景

.customer-tree::-webkit-scrollbar-thumb:hover{
  background-color:#B2B8C9;
}
.customer-tree::-webkit-scrollbar-track:hover{
  background-color:#fff;
}
.popover-area {
  text-align: center;
  cursor: pointer;
  line-height: 14px;
  &:hover {
    color: #296DD3;
  }
  .zhiding {
    font-size: 14px;
  }
}
</style>
