// 匹配备注信息
import './style.scss';

const RemarkInfo = (props, tabType) => {
  const {
    recallRemark, approveTime, reason, createTime, remark, status, auditType,
  } = props;
  const dynamicReason = JSON.parse(reason) || [];
  const { hl = [] } = dynamicReason[0] || {};
  const isShenHe = ['2', '3', '4'].includes(tabType);
  const obj = isShenHe ? {
    approveTime,
    label: `${auditType ? '人工' : '自动'}审核`,
    detail: remark,
    display: true,
  } : {
    approveTime,
    label: '召回备注',
    detail: recallRemark,
    display: tabType === '5' || (status === 2 && tabType === '1'),
  };
  return <div className='remark-info'>
    {
      obj.display && <>
        <p className='before-circle'>{obj.label} | {obj.approveTime || '-'}</p>
        <p className='remark-info-detail'>{obj.detail || '-'}</p>
      </>
    }
    <p className='before-circle'>匹配信息 | {createTime || '-'}</p>
    <p v-html={hl[0] || '-'} className='remark-info-detail'/>
  </div>;
};
export default RemarkInfo;
