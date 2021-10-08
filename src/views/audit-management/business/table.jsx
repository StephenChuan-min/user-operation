import { PUSH_STATUS } from '@/static';
import RemarkInfo from '@/components/column-pane/remark-info';
import AssetInfo from '@/components/column-pane/asset-info';
import AuctionInfo from '@/components/column-pane/auction-info';

const columnHtml = (props, tabType) => {
  const { status = '' } = props || {};
  const obj = PUSH_STATUS.find((i) => status === i.value) || {};
  return {
    assetInfo: AssetInfo(props),
    remarkInfo: RemarkInfo(props, tabType),
    auctionInfo: AuctionInfo(props),
    status: obj.label,
  };
};
export default columnHtml;
