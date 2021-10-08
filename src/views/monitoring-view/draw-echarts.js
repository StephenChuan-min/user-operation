import * as echarts from 'echarts';

const drawEcharts = (dataList = [], el, date) => {
  const obj = {};
  const xData = [];
  const series = [];
  const legendData = [];
  const baseInfo = {
    'match-statistics': {
      matchNum: {
        name: '匹配数据量',
        legendName: null,
        color: ['#5BB4F7', '#3180EC'],
      },
      pushNum: {
        name: '实际推送量',
        legendName: null,
        color: ['#5BDFC6', '#1BBA7C'],
      },
      rate: {
        name: '推送率',
        legendName: null,
        color: 'transparent',
      },
      diffNum: {
        name: null,
        legendName: null,
        color: 'transparent',
      },
      other: {
        tooltip: {
          formatter: (params) => (`
            <div class="tooltip-custom">
              <div>匹配推送情况</div>
              <div>${params[0].name}</div>
              <div class="before blue">${params[0].seriesName}：${params[0].data}条</div>
              <div class="before green">${params[1].seriesName}：${params[1].data}条</div>
              <div>${params[2].seriesName}：${(params[2].data * 100).toFixed(2)}% (少${Math.abs(params[3].data)}条)</div>
            </div>
        `),
        },
      },
    },
    'data-trend': {
      dbIncr: {
        name: '监控库增量',
        legendName: '监控库增量',
        color: ['#5BB4F7', '#3180EC'],
      },
      esIncr: {
        name: 'ES增量',
        legendName: 'ES增量',
        color: ['#FEB754', '#FF871C'],
      },
      other: {
        tooltip: {
          formatter: (params) => (`
            <div class="tooltip-custom">
              <div>数据增量统计</div>
              <div>${params[0].name}</div>
              <div class="before blue">${params[0].seriesName}：${params[0].data}条</div>
              <div class="before yellow">${params[1].seriesName}：${params[1].data}条</div>
            </div>
        `),
        },
      },
    },
    'match-distribute': {
      matchNum: {
        name: '匹配数据量',
        legendName: '匹配数据量',
        color: ['#5BB4F7', '#3180EC'],
      },
      pushNum: {
        name: '实际推送量',
        legendName: '实际推送量',
        color: ['#5BDFC6', '#5BDFC6'],
      },
      other: {
        tooltip: {
          formatter: (params) => (`
            <div class="tooltip-custom">
              <div>全部</div>
              <div>${date}&nbsp;&nbsp;${params[0].name}时</div>
              <div class="before blue">${params[0].seriesName}：${params[0].data}条</div>
              <div class="before green">${params[1].seriesName}：${params[1].data}条</div>
            </div>
        `),
        },
      },
    },
    'data-distribute': {
      dbIncr: {
        name: '监控库增量',
        legendName: '监控库增量',
        color: ['#5BB4F7', '#3180EC'],
      },
      esIncr: {
        name: 'ES增量',
        legendName: 'ES增量',
        color: ['#FEB754', '#FF871C'],
      },
      other: {
        tooltip: {
          formatter: (params) => (`
            <div class="tooltip-custom">
              <div>全部</div>
              <div>${date}&nbsp;&nbsp;${params[0].name}时</div>
              <div class="before blue">${params[0].seriesName}：${params[0].data}条</div>
              <div class="before yellow">${params[1].seriesName}：${params[1].data}条</div>
            </div>
        `),
        },
      },
    },
    'recall-statistics': {
      pushNum: {
        name: '推送数据量',
        legendName: null,
        color: 'transparent',
      },
      recallNum: {
        name: '召回数据量',
        legendName: null,
        color: 'transparent',
      },
      rate: {
        name: '召回率',
        legendName: '召回率',
        color: ['#FF8C8D', '#FF3134'],
      },
      other: {
        tooltip: {
          formatter: (params) => (`
            <div class="tooltip-custom">
              <div>召回情况</div>
              <div>${params[0].name}</div>
              <div>${params[0].seriesName}：${params[0].data}条</div>
              <div>${params[1].seriesName}：${params[1].data}条</div>
              <div class="before red">${params[2].seriesName}：${params[2].data}%</div>
            </div>
        `),
        },
        yFormatter: (value) => (`
          ${Number(value).toFixed(2)}%
          `
        ),
      },
    },
  };
  dataList.forEach((item) => {
    xData.push(item.x);
  });
  Object.keys(baseInfo[el]).forEach((key) => {
    if (key !== 'other') {
      obj[key] = [];
      legendData.push(baseInfo[el][key].legendName);
      dataList.forEach((item) => {
        obj[key].push(item[key]);
      });
    }
  });
  Object.keys(obj).forEach((key) => {
    const { name, color } = baseInfo[el][key];
    const temp = {
      name,
      type: 'line',
      symbol: 'circle',
      symbolSize: 7,
      showSymbol: false,
      itemStyle: {
        color: (color instanceof Array) ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: color[0] },
          { offset: 1, color: color[1] },
        ]) : color,
      },
      lineStyle: {
        color: (color instanceof Array) ? new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: color[0] },
          { offset: 1, color: color[1] },
        ]) : color,
      },
      data: obj[key],
    };
    series.push(temp);
  });
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      textStyle: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'normal',
      },
      formatter: baseInfo[el].other.tooltip.formatter,
    },
    legend: {
      data: legendData,
      top: 16,
      right: 30,
      itemGap: 40,
      lineStyle: {
        width: 0,
      },
      textStyle: {
        fontSize: 14,
        color: '#4E5566',
      },
      selectedMode: false,
      itemWidth: 8,
      itemHeight: 8,
    },
    grid: {
      left: '4%',
      right: '6%',
      bottom: '4%',
      containLabel: true,
    },
    axisPointer: {
      lineStyle: {
        color: '#20242E',
        type: 'solid',
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#DDE0E7',
        },
      },
      axisLabel: {
        color: '#7D8699',
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: el === 'recall-statistics' ? Math.min(Math.max(...obj.rate) * 1.2, 100) : null,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#DDE0E7',
        },
      },
      axisLabel: {
        color: '#7D8699',
        formatter: baseInfo[el].other.yFormatter,
      },
    },
    series,
  };
  const chartDom = document.getElementById(el);
  const myChart = echarts.init(chartDom);
  myChart.setOption(option);
  return myChart;
};
export default drawEcharts;
