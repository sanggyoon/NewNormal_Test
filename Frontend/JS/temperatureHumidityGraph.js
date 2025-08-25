(function () {
  // ECharts가 로드될 때까지 대기
  function waitForECharts() {
    if (typeof echarts !== 'undefined') {
      initTemperatureHumidityCharts();
    } else {
      setTimeout(waitForECharts, 100);
    }
  }

  function initTemperatureHumidityCharts() {
    const sp = window.SelectedPoint;
    const useClean = !!(sp && sp.temp && sp.humid);

    // 라벨 (오래된 → 최신)
    const labels = useClean && sp.temp.series?.length
      ? Array.from({ length: sp.temp.series.length }, (_, i) => {
          const d = new Date();
          d.setHours(d.getHours() - (sp.temp.series.length - 1 - i));
          return `${String(d.getHours()).padStart(2, '0')}:00`;
        })
      : Array.from({ length: 12 }, (_, i) => {
          const d = new Date();
          d.setHours(d.getHours() - (11 - i));
          return `${String(d.getHours()).padStart(2, '0')}:00`;
        });

    // ------------------ 온도 그래프 ------------------
    const tempChartDom = document.getElementById('temperatureChart');
    if (tempChartDom) {
      const tempChart = echarts.init(tempChartDom);
      
      // 온도 범위 계산
      let tempMin = 0, tempMax = 50;
      if (useClean) {
        tempMin = Math.min(...sp.temp.series);
        tempMax = Math.max(...sp.temp.series);
        const margin = (tempMax - tempMin) * 0.2 || 1;
        tempMin -= margin;
        tempMax += margin;
      }

      const tempOption = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            return params[0].name + '<br/>' + 
                   '<span style="color:' + params[0].color + '">온도: ' + 
                   params[0].value + '°C</span>';
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '25%',
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
          min: tempMin,
          max: tempMax,
          axisLabel: {
            fontSize: 10,
            formatter: function(value) {
              return value.toFixed(1) + '°C';
            }
          }
        },
        series: [{
          name: '온도',
          type: 'line',
          data: useClean ? sp.temp.series : [25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25],
          smooth: true,
          symbolSize: 4,
          lineStyle: { width: 2, color: '#FF5384' },
          itemStyle: { color: '#FF5384' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 83, 132, 0.3)' },
                { offset: 1, color: 'rgba(255, 83, 132, 0.1)' }
              ]
            }
          }
        }],
        animation: true,
        responsive: true
      };

      tempChart.setOption(tempOption);

      // 창 크기 변경 시 차트 리사이즈
      window.addEventListener('resize', function() {
        tempChart.resize();
      });
    }

    // ------------------ 습도 그래프 ------------------
    const humidChartDom = document.getElementById('humidityChart');
    if (humidChartDom) {
      const humidChart = echarts.init(humidChartDom);
      
      // 습도 범위 계산
      let humidMin = 0, humidMax = 100;
      if (useClean) {
        humidMin = Math.min(...sp.humid.series);
        humidMax = Math.max(...sp.humid.series);
        const margin = (humidMax - humidMin) * 0.2 || 1;
        humidMin -= margin;
        humidMax += margin;
      }

      const humidOption = {
        tooltip: {
          trigger: 'axis',
          formatter: function(params) {
            return params[0].name + '<br/>' + 
                   '<span style="color:' + params[0].color + '">습도: ' + 
                   params[0].value + '%</span>';
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '25%',
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
          min: humidMin,
          max: humidMax,
          axisLabel: {
            fontSize: 10,
            formatter: function(value) {
              return value.toFixed(1) + '%';
            }
          }
        },
        series: [{
          name: '습도',
          type: 'line',
          data: useClean ? sp.humid.series : [60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60, 60],
          smooth: true,
          symbolSize: 4,
          lineStyle: { width: 2, color: '#36A2EB' },
          itemStyle: { color: '#36A2EB' },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(54, 162, 235, 0.3)' },
                { offset: 1, color: 'rgba(54, 162, 235, 0.1)' }
              ]
            }
          }
        }],
        animation: true,
        responsive: true
      };

      humidChart.setOption(humidOption);

      // 창 크기 변경 시 차트 리사이즈
      window.addEventListener('resize', function() {
        humidChart.resize();
      });
    }
  }

  // ECharts 로드 대기 시작
  waitForECharts();
})();
