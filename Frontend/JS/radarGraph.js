(function () {
  // JSCharting이 로드될 때까지 대기
  function waitForJSCharting() {
    if (typeof JSC !== 'undefined') {
      console.log('JSCharting 라이브러리 로드됨:', JSC);
      console.log('JSCharting 버전:', JSC.version);
      initRadarChart();
    } else {
      console.log('JSCharting 로딩 대기 중...');
      setTimeout(waitForJSCharting, 100);
    }
  }

  function initRadarChart() {
    const chartDom = document.getElementById('radarGraph');
    if (!chartDom) return;

    const sp = window.SelectedPoint;
    
    // 디버깅을 위한 데이터 로그
    console.log('SelectedPoint 데이터:', sp);
    console.log('가스 데이터 구조:', sp?.gases);
    
    // 데이터 검증 및 기본값 설정
    let radarData = [];
    let timeLabels = [];

    // 데이터 유효성 검사 - SelectedPoint의 gases 구조 확인
    const hasValidData = sp && 
                        sp.gases && 
                        sp.gases.NH3 && 
                        sp.gases.NH3.series && 
                        Array.isArray(sp.gases.NH3.series) && 
                        sp.gases.NH3.series.length > 0;

    console.log('데이터 유효성:', hasValidData);

    if (hasValidData) {
      // 실제 데이터가 있는 경우
      const dataLength = sp.gases.NH3.series.length;
      console.log('데이터 길이:', dataLength);
      
      timeLabels = Array.from({ length: dataLength }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (dataLength - 1 - i));
        return `${String(d.getHours()).padStart(2, '0')}:00`;
      });

      // 각 가스 데이터의 유효성 검사 및 안전한 기본값 제공
      const getSafeSeries = (gasData, defaultValue = 1) => {
        if (gasData && gasData.series && Array.isArray(gasData.series) && gasData.series.length > 0) {
          return gasData.series;
        }
        return Array.from({ length: dataLength }, () => defaultValue);
      };

      radarData = [
        {
          name: '암모니아(NH3)',
          points: getSafeSeries(sp.gases.NH3, 1).map((value, index) => [timeLabels[index], value]),
          color: '#5470c6'
        },
        {
          name: '황화수소(H2S)',
          points: getSafeSeries(sp.gases.H2S, 1).map((value, index) => [timeLabels[index], value]),
          color: '#92cc75'
        },
        {
          name: '메탄(CH4)',
          points: getSafeSeries(sp.gases.CH4, 1).map((value, index) => [timeLabels[index], value]),
          color: '#fdcb32'
        },
        {
          name: '이산화탄소(CO2)',
          points: getSafeSeries(sp.gases.CO2, 1).map((value, index) => [timeLabels[index], value]),
          color: '#fc4032'
        }
      ];
    } else {
      // 더미 데이터 (기본값) - dummyData.js 구조에 맞게
      console.log('더미 데이터 사용');
      timeLabels = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (11 - i));
        return `${String(d.getHours()).padStart(2, '0')}:00`;
      });

      // dummyData.js와 동일한 구조의 더미 데이터 생성
      const dummyGas1 = [2.1, 2.2, 2.0, 2.3, 2.4, 2.1, 2.0, 2.2, 2.3, 2.1, 2.2, 2.0];
      const dummyGas2 = [0.8, 0.9, 0.7, 0.8, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.7, 0.8];
      const dummyGas3 = [0.3, 0.4, 0.2, 0.3, 0.4, 0.3, 0.2, 0.3, 0.4, 0.3, 0.2, 0.3];
      const dummyGas4 = [0.7, 0.8, 0.6, 0.7, 0.8, 0.7, 0.6, 0.7, 0.8, 0.7, 0.6, 0.7];

      radarData = [
        {
          name: '암모니아(NH3)',
          points: timeLabels.map((label, index) => [label, dummyGas1[index]]),
          color: '#5470c6'
        },
        {
          name: '황화수소(H2S)',
          points: timeLabels.map((label, index) => [label, dummyGas2[index]]),
          color: '#92cc75'
        },
        {
          name: '메탄(CH4)',
          points: timeLabels.map((label, index) => [label, dummyGas3[index]]),
          color: '#fdcb32'
        },
        {
          name: '이산화탄소(CO2)',
          points: timeLabels.map((label, index) => [label, dummyGas4[index]]),
          color: '#fc4032'
        }
      ];
    }

    // 데이터 유효성 최종 검사
    if (!radarData || radarData.length === 0) {
      console.error('레이더 차트 데이터가 유효하지 않습니다.');
      return;
    }

    console.log('최종 레이더 데이터:', radarData);

    // JSCharting 레이더 차트 생성 - 더 간단한 설정으로 시작
    try {
      const radarChart = JSC.chart('radarGraph', {
        debug: true, // 디버그 모드 활성화
        type: 'radar spider', // 기본 라인 차트로 시작
        defaultCultureName: 'ko-KR',
        defaultPoint: {
          tooltip: '<b>%icon %xValue</b><br/>%seriesName : %yValue',
          marker_visible: true
        },
        xAxis: {
          spacingPercentage: 0.05,
          defaultTick: { 
            padding: 5,
            label_style: { fontFamily: 'Noto Sans KR' }
          },
          // 레이더 차트에 맞는 축 설정
          scale_type: 'auto',
          label_style: { fontFamily: 'Noto Sans KR' }
        },
        yAxis: {
          formatString: 'd',
          scale_range_min: 0,
          label_style: { fontFamily: 'Noto Sans KR' }
        },
        defaultSeries: { 
          opacity: 0.7, 
          line_width: 3,
          defaultPoint: {
            label_style: { fontFamily: 'Noto Sans KR' }
          }
        },
        series: radarData.map(data => ({
          name: data.name,
          color: data.color,
          points: data.points,
          defaultPoint: {
            marker: {
              visible: true,
              size: 6,
              fill: '#fff',
              outline_width: 2,
              outline_color: data.color,
            },
            label_style: { fontFamily: 'Noto Sans KR' }
          },
        })),
        // 차트 크기 명시적 설정
        width: '100%',
        height: '100%',
        // 차트 영역 설정 - 외부 타이틀을 고려하여 조정
        chartArea: {
          margin: '10% 15% 15% 15%'
        },
        // 레이더 차트 특화 설정
        polar: {
          enabled: true
        },
        // 외부 타이틀 사용으로 내부 타이틀 제거
        legend: {
          visible: true,
          position: 'top right', // 우측 상단으로 이동
          template: '%icon,%name',
          defaultEntry: {
            style: { 
              fontFamily: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
              fontSize: 12
            }
          },
          // 범례 위치 조정 - 외부 타이틀 우측에 나란히
          margin: '10px 10px 0 0',
          // 범례 배경 및 테두리
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #e5e5e6',
          borderRadius: '6px',
          padding: '8px 12px'
        },
      });

      // 창 크기 변경 시 차트 리사이즈
      window.addEventListener('resize', function() {
        if (radarChart) {
          try {
            // radar 타입 차트의 경우 다른 방법으로 크기 조정
            if (radarChart.resize) {
              radarChart.resize();
            } else if (radarChart.reflow) {
              radarChart.reflow();
            } else if (radarChart.render) {
              radarChart.render();
            }
          } catch (resizeError) {
            console.error('차트 리사이즈 에러:', resizeError);
          }
        }
      });

      // 차트가 제대로 렌더링되었는지 확인
      setTimeout(() => {
        if (radarChart) {
          console.log('차트 객체:', radarChart);
          console.log('차트 DOM 요소:', document.getElementById('radarGraph'));
          console.log('사용 가능한 메서드:', Object.getOwnPropertyNames(radarChart));
          
          // 차트 크기 강제 설정
          try {
            if (radarChart.resize) {
              radarChart.resize();
              console.log('차트 리사이즈 완료');
            } else if (radarChart.reflow) {
              radarChart.reflow();
              console.log('차트 리플로우 완료');
            } else if (radarChart.render) {
              radarChart.render();
              console.log('차트 렌더링 완료');
            }
          } catch (resizeError) {
            console.error('차트 크기 조정 에러:', resizeError);
          }
        }
      }, 100);

      console.log('JSCharting 라인 차트 초기화 완료', radarData);
    } catch (error) {
      console.error('JSCharting 차트 생성 중 에러 발생:', error);
      console.error('에러 상세:', error.message);
      console.error('스택 트레이스:', error.stack);
      
      // 에러 발생 시 간단한 메시지 표시
      const chartDom = document.getElementById('radarGraph');
      if (chartDom) {
        chartDom.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">차트 로딩 중 오류가 발생했습니다.</div>';
      }
    }
  }

  // JSCharting 로드 대기 시작
  waitForJSCharting();
})();
