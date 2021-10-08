import {
  reactive,
} from 'vue';

const main = () => {
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
  const rules = reactive({
    org: [
      { required: true, message: '请选择机构名称', trigger: 'change' },
    ],
    time: [
      { required: true, message: '请选择更新时间', trigger: 'change' },
    ],
    startTime: [
      {
        required: true,
        message: '请选择开始时间',
        trigger: 'change',
        type: 'date',
      },
    ],
    endTime: [
      {
        required: true,
        message: '请选择结束时间',
        trigger: 'change',
        type: 'date',
      },
    ],
    end: [
      {
        required: true,
        message: '请选择截止日期',
        trigger: 'change',
        type: 'date',
      },
    ],
  });
  return {
    rules,
    shortcuts,
    reportFormOptions,
  };
};
export default main;
