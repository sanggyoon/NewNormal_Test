(function () {
  // ECharts가 로드될 때까지 대기
  function waitForECharts() {
    if (typeof echarts !== 'undefined') {
      initGasLineChart();
    } else {
      setTimeout(waitForECharts, 100);
    }
  }

  function initGasLineChart() {
    const chartDom = document.getElementById('gasLineChart');
    if (!chartDom) return;

    const myChart = echarts.init(chartDom);
    
    // 세션데이터
    const sp = window.SelectedPoint;
    const useClean = !!(sp && sp.gases);

    // 라벨(오래된→최신)
    const labels = useClean && sp?.gases?.NH3?.series?.length
      ? Array.from({ length: sp.gases.NH3.series.length }, (_, i) => {
          const d = new Date();
          d.setHours(d.getHours() - (sp.gases.NH3.series.length - 1 - i));
          return `${String(d.getHours()).padStart(2, '0')}:00`;
        })
      : Array.from({ length: 12 }, (_, i) => {
          const d = new Date();
          d.setHours(d.getHours() - (11 - i));
          return `${String(d.getHours()).padStart(2, '0')}:00`;
        });

    // 데이터셋
    const datasets = useClean
      ? [
          {
            name: '암모니아',
            data: sp.gases.NH3.series,
            type: 'line',
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
            itemStyle: { color: '#FF6384' }
          },
          {
            name: '황화수소',
            data: sp.gases.H2S.series,
            type: 'line',
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
            itemStyle: { color: '#36A2EB' }
          },
          {
            name: '메탄',
            data: sp.gases.CH4.series,
            type: 'line',
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
            itemStyle: { color: '#FFCE56' }
          },
          {
            name: '이산화탄소',
            data: sp.gases.CO2.series,
            type: 'line',
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
            itemStyle: { color: '#4BC0C0' }
          }
        ]
      : [
          {
            name: '암모니아',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            type: 'line',
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
            itemStyle: { color: '#FF6384' }
          },
          {
            name: '황화수소',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            type: 'line',
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
            itemStyle: { color: '#36A2EB' }
          },
          {
            name: '메탄',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            type: 'line',
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
            itemStyle: { color: '#FFCE56' }
          },
          {
            name: '이산화탄소',
            data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            type: 'line',
            smooth: true,
            symbolSize: 6,
            lineStyle: { width: 2 },
            itemStyle: { color: '#4BC0C0' }
          }
        ];

    const option = {
      title: {
        text: '시간별 추이',
        left: 10,
        top: 10,
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333',
          fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params) {
          let result = params[0].name + '<br/>';
          params.forEach(function(item) {
            result += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' + item.color + '"></span>';
            result += item.seriesName + ': ' + (item.value * 1.0).toFixed(2) + '<br/>';
          });
          return result;
        }
      },
      legend: {
        data: ['암모니아', '황화수소', '메탄', '이산화탄소'],
        top: 10,
        right: 10,
        orient: 'horizontal',
        textStyle: {
          fontSize: 12
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLabel: {
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        scale: true,
        axisLabel: {
          fontSize: 10
        }
      },
      series: datasets,
      animation: true,
      responsive: true
    };

    myChart.setOption(option);

    // 창 크기 변경 시 차트 리사이즈
    window.addEventListener('resize', function() {
      myChart.resize();
    });
  }

  // ECharts 로드 대기 시작
  waitForECharts();
})();
