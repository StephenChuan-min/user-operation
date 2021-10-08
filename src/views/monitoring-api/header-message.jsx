import { defineComponent } from 'vue';
import '@/views/my-org/header/style.scss';
import tipImg from '../../assets/img/icon.png';

const App = defineComponent({
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  render() {
    const {
      apiNums = 0, debtorNums = 0, apiExpireNums = 0,
    } = this.data || {};
    const contentList = [
      {
        title: 'API总数',
        number: apiNums,
        img: '#iconAPI',
        hasUnit: false,
      },
      {
        title: 'divide',
      },
      {
        title: '即将过期API数',
        number: apiExpireNums,
        img: '#iconguoqijigou',
        hasUnit: false,
        showTip: true,
      },
      {
        title: 'divide',
      },
      {
        title: '监控债务人总数',
        number: debtorNums,
        img: '#iconzhaiwuren',
        hasUnit: true,
      },
    ];
    return (
      <div className="my-org-message">
        {
          contentList.map((item) => (item.title !== 'divide'
            ? <div className="my-org-message-item">
                <div className="up">
                  <svg class="icon" aria-hidden="true" style={{ fontSize: '18px' }}>
                    <use xlink:href={item.img}/>
                  </svg>
                  <span>{item.title}</span>
                  <el-tooltip
                    effect="dark"
                    content="合同结束日期距今日三个月内"
                    placement="top"
                  >
                    <img src={tipImg} v-show={item.showTip} style="margin-left: 5px"/>
                  </el-tooltip>
                </div>
                <div className="down">
                  {item.number}
                  {item.hasUnit
                    ? <span style={{
                      fontSize: '14px',
                      marginLeft: '4px',
                    }}>名</span>
                    : ''}
                </div>
              </div>
            : <div className="divider"/>))
        }
      </div>
    );
  },
});
export default App;
