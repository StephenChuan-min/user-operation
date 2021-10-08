import { ASSETS_INFO } from '@/static';
import './style.scss';

const levelType = {
  3: '一级',
  4: '二级',
  5: '三级',
  6: '四级',
  7: '五级',
  8: '六级',
};
const setShow = (props, key) => {
  if (key === 'conSumerName') {
    // 设置客户使用机构
    const level = levelType[props.level];
    return level ? `【${level}】${props.conSumerName || ''}` : '-';
  }
  return props[key] || '-';
};
const AssetInfo = (props) => <div className='asset-info'>
  <ul>
    {
      ASSETS_INFO.map((i) => (
        <li className='asset-info-item'>
          <span className='asset-info-item-label'>{i.lable}：</span>
          <span className='asset-info-item-detail'>{setShow(props, i.key)} </span>
        </li>
      ))
    }
  </ul>
  { props.important === 1 ? <svg class="icon jz" aria-hidden="true" style="font-size: 37px;">
    <use xlink:href="#iconjingzhun" />
  </svg> : ''}
</div>;
export default AssetInfo;
