export const defaultChartOption = {
  title: {
    text: '',
    left: '3%',
    textStyle: {
      fontSize: 16
    }
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    data: []
  },
  yAxis: {
    type: 'value',
    min:0,
    max:100,
    splitNumber: 5,
    axisLabel: {
      formatter: '{value} %'
    }
  },
  legend: {
    data: []
  },
  dataZoom: [
    {
      type: 'inside',
      start: 50,
      end: 100
    },
    {
      show: true,
      type: 'slider',
      y: '90%',
      start: 50,
      end: 100
    }
  ],
  series: []
}
