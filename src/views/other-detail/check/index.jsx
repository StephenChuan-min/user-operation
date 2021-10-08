import {
  defineComponent, getCurrentInstance, onMounted, reactive, toRaw,
} from 'vue';
import BreadCrumb from '@/components/bread-crumb/index.vue';
import { handlePart, ModalTitle } from '@/static/fn';
import { roleInfoColumn } from '@/static/column';
import { handleObligors } from '@/utils';
import './style.scss';
import CommonApi from '@/server/api/common';
import { tableEmptytSlots } from '@/static/slot';

const Item = (props) => {
  const { id, key, val } = props;
  switch (key) {
    case 'title':
      return <a href={`/sourceWeb/${id}`} target='_blank' className='button-link'>{val}</a>;
    case 'buildingArea':
      return <span className='area-field'>{val} <i v-show={val !== '-'}>m<sup>2</sup></i></span>;
    case 'landArea':
      return <span className='area-field'>{val} <i v-show={val !== '-'}>m<sup>2</sup></i></span>;
    case 'ah':
      if (!val.length) return '-';
      return ((val || []).map((i) => <p key={i}>{i}</p>));
    case 'wsUrl':
      if (!val.length) return '-';
      return ((val || []).map((i) => <p><a key={i} href={i} target='_blank' className='button-link'>{i}</a></p>));
    default:
      return val;
  }
};

const Part = (props, { slots }) => {
  const {
    label, parentKey, list, width,
  } = props;
  return <div className="part" key={parentKey} style={{ width }}>
    <h4>{label}</h4>
    {
      slots.default ? slots.default() : <ul>
        {
          list.map((i) => <li key={i.key} className={i.key}>
            <div>{i.lable}：</div>
            <div>
              {Item(i)}
            </div>
          </li>)
        }
      </ul>
    }
  </div>;
};

export default defineComponent({
  setup() {
    const { proxy } = getCurrentInstance();
    const state = reactive({
      assetDetail: {},
      visible: false,
      value: '',
      loading: false,
    });
    const handleClick = () => {
      state.loading = true;
      const { params: { auctionId } } = proxy.$route;
      const remark = state.value;
      CommonApi.auditBack({ auctionId, remark }).then((res) => {
        const { code } = res.data || {};
        if (code === 200) {
          proxy.$message.success({
            message: '退回成功',
            duration: 1500,
            onClose: () => {
              localStorage.setItem('backSign', 'SUCCESS');
              state.visible = false;
              state.loading = false;
              window.close();
            },
          });
        } else {
          proxy.$message.error('退回失败');
          state.loading = false;
        }
      });
    };
    const modalSlots = {
      title: null,
      footer: () => <>
      <el-button onClick={() => state.visible = false}>取 消</el-button>
      <el-button type="primary" onClick={handleClick} loading={state.loading}>确定</el-button>
      </>,
    };
    const params = () => {
      const { isBack } = state.assetDetail;
      return isBack ? {
        title: '确认再次退回本条数据?',
        text: '点击确定，错误原因将被覆盖',
      } : {
        title: '确认将本条数据退回至检查人员?',
        text: '点击确定，该条数据将被退回至结构化检查人员，修改后将会重新匹配',
      };
    };
    const handleOpen = () => {
      const { assetDetail: { isBack, remark }, value } = state;
      state.visible = true;
      const text = isBack ? remark : '';
      state.value = value || text;
    };
    const handleConfirm = () => {
      const { params: { auctionId } } = proxy.$route;
      CommonApi.confirm(auctionId).then((res) => {
        const { code, message } = res.data || {};
        if (code === 200) {
          proxy.$message.success({
            message: '操作成功',
            duration: 1000,
            onClose: () => window.close(),
          });
        } else {
          proxy.$message.error(message);
        }
      });
    };
    onMounted(() => {
      const { params: { auctionId } } = proxy.$route;
      CommonApi.assetDetail(auctionId).then((res) => {
        const { code, data } = res.data || {};
        if (code === 200) {
          state.assetDetail = data || {};
        } else {
          proxy.$message.error('请求出错');
        }
        const { title } = data || {};
        document.title = title || '结构化校验/详情';
      });
    });
    return {
      state, modalSlots, params, handleOpen, handleConfirm,
    };
  },
  render() {
    const {
      modalSlots, state, params, handleOpen, handleConfirm,
    } = this;
    const { obligors, isBack } = state.assetDetail;
    const partDatas = handlePart(toRaw(state.assetDetail));
    return (
      <div className="yc-newpage-contaner">
        <section className="main-wrapper structure-check-wrapper">
          <BreadCrumb text='结构化校验/详情' />
          <div className="main-content">
            <div className="main-content-top">
              <el-button type="primary" class="button-first action-button" onClick ={handleOpen}>{Number(isBack) ? '再次退回' : '退回'}</el-button>
              <el-button class="btn-fourth action-button" onClick={handleConfirm}>确认并关闭</el-button>
              {partDatas.map((i) => <Part {...i}/>)}
            </div>
            <div className="main-content-btm">
              <Part label='角色信息'>
                <el-table
                  data={handleObligors(obligors)}
                  style="width: 100%"
                  row-key={(val) => val.id}
                  v-slots={tableEmptytSlots}
                >
                  {
                    roleInfoColumn.map((i) => <el-table-column prop={i.prop} label={i.label} key={i.class} min-width={i.width}/>)
                  }
                </el-table>
              </Part>
            </div>
            <div className="main-content-modal yc-custom-modal">
              <el-dialog
                v-model={state.visible}
                width="500px"
                destroy-on-close
                show-close={false}
                v-slots={modalSlots}
                lock-scroll={false}
              >
                <ModalTitle {...params()}/>
                <div className="main-content-modal-body">
                  <div className='label'>备注：</div>
                  <el-input
                    type="textarea"
                    autosize
                    placeholder="请输入..."
                    maxLength={1000}
                    v-model={state.value}
                    onBlur={() => state.value = state.value.trim()}
                  >
                  </el-input>
                  <span className='val-length'>{(state.value || '').length}/1000</span>
                </div>
              </el-dialog>
            </div>
          </div>
        </section>
      </div>
    );
  },
});
