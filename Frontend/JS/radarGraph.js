(function () {
  let tooltipModal = null;
  let isModalVisible = false;
  let radarChart = null;

  function waitForJSCharting() {
    if (typeof JSC !== 'undefined') {
      console.log('JSCharting 라이브러리 로드됨:', JSC);
      initRadarChart();
    } else {
      console.log('JSCharting 로딩 대기 중...');
      setTimeout(waitForJSCharting, 100);
    }
  }

  function createTooltipModal() {
    if (tooltipModal) {
      tooltipModal.remove();
    }

    tooltipModal = document.createElement('div');
    tooltipModal.className = 'radar-tooltip-modal';
    tooltipModal.innerHTML = `
      <div class="tooltip-header"></div>
      <div class="tooltip-content"></div>
    `;
    document.body.appendChild(tooltipModal);
    return tooltipModal;
  }

  function showTooltipModal(timeLabel, clientX, clientY) {
    console.log('모달 표시:', timeLabel, 'at', clientX, clientY);

    const modal = createTooltipModal();
    const header = modal.querySelector('.tooltip-header');
    const content = modal.querySelector('.tooltip-content');

    header.textContent = `${timeLabel}`;

    const gasInfo = getGasInfoByTime(timeLabel);
    content.innerHTML = '';

    if (gasInfo) {
      gasInfo.forEach((gas) => {
        const item = document.createElement('div');
        item.className = 'tooltip-item';
        item.innerHTML = `
          <div class="tooltip-label">
            <div class="tooltip-color-dot" style="background-color: ${
              gas.color
            }"></div>
            ${gas.name}
          </div>
          <div class="tooltip-value">${gas.value.toFixed(
            2
          )}<span class="tooltip-unit">ppm</span></div>
        `;
        content.appendChild(item);
      });
    }

    // 모달을 먼저 표시해서 실제 크기를 측정
    modal.style.visibility = 'hidden';
    modal.style.display = 'block';
    document.body.appendChild(modal);
    
    // 실제 모달 크기 측정
    const modalRect = modal.getBoundingClientRect();
    const modalWidth = modalRect.width;
    const modalHeight = modalRect.height;
    
    // 모달 위치 계산 - 마우스 커서 바로 옆에 배치
    const offset = 10; // 커서와 모달 사이의 간격
    let x = clientX + offset;
    let y = clientY - modalHeight / 2; // 모달의 세로 중앙이 커서 위치에 오도록

    // 화면 오른쪽 경계 체크
    if (x + modalWidth > window.innerWidth - 10) {
      x = clientX - modalWidth - offset; // 왼쪽에 배치
    }
    
    // 화면 위쪽 경계 체크
    if (y < 10) {
      y = 10;
    }
    
    // 화면 아래쪽 경계 체크
    if (y + modalHeight > window.innerHeight - 10) {
      y = window.innerHeight - modalHeight - 10;
    }

    // 최종 위치 설정
    modal.style.left = x + 'px';
    modal.style.top = y + 'px';
    modal.style.visibility = 'visible';
    modal.classList.add('visible');
    isModalVisible = true;
  }

  function hideTooltipModal() {
    if (tooltipModal && isModalVisible) {
      tooltipModal.classList.remove('visible');
      isModalVisible = false;
    }
  }

  function getGasInfoByTime(timeLabel) {
    const sp = window.SelectedPoint;
    const hasValidData = sp?.gases?.NH3?.series?.length > 0;

    if (hasValidData) {
      const dataLength = sp.gases.NH3.series.length;
      const timeLabels = Array.from({ length: dataLength }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (dataLength - 1 - i));
        return `${String(d.getHours()).padStart(2, '0')}:00`;
      });

      const index = timeLabels.indexOf(timeLabel);
      if (index !== -1) {
        return [
          {
            name: '암모니아(NH3)',
            value: sp.gases.NH3.series[index] || 0,
            color: '#5470c6',
          },
          {
            name: '황화수소(H2S)',
            value: sp.gases.H2S?.series?.[index] || 0,
            color: '#92cc75',
          },
          {
            name: '메탄(CH4)',
            value: sp.gases.CH4?.series?.[index] || 0,
            color: '#fdcb32',
          },
          {
            name: '이산화탄소(CO2)',
            value: sp.gases.CO2?.series?.[index] || 0,
            color: '#fc4032',
          },
        ];
      }
    }

    // 더미 데이터
    const hours = parseInt(timeLabel.split(':')[0]) || new Date().getHours();
    const dummyValues = {
      NH3: [2.1, 2.2, 2.0, 2.3, 2.4, 2.1, 2.0, 2.2, 2.3, 2.1, 2.2, 2.0],
      H2S: [0.8, 0.9, 0.7, 0.8, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.7, 0.8],
      CH4: [0.3, 0.4, 0.2, 0.3, 0.4, 0.3, 0.2, 0.3, 0.4, 0.3, 0.2, 0.3],
      CO2: [0.7, 0.8, 0.6, 0.7, 0.8, 0.7, 0.6, 0.7, 0.8, 0.7, 0.6, 0.7],
    };
    const index = hours % 12;

    return [
      {
        name: '암모니아(NH3)',
        value: dummyValues.NH3[index],
        color: '#5470c6',
      },
      {
        name: '황화수소(H2S)',
        value: dummyValues.H2S[index],
        color: '#92cc75',
      },
      { name: '메탄(CH4)', value: dummyValues.CH4[index], color: '#fdcb32' },
      {
        name: '이산화탄소(CO2)',
        value: dummyValues.CO2[index],
        color: '#fc4032',
      },
    ];
  }

  // 각도와 거리를 이용해 시간대 계산 (JSCharting 레이더 차트 기준으로 수정)
  function getTimeFromPosition(mouseX, mouseY, chartRect) {
    const centerX = chartRect.left + chartRect.width / 2;
    const centerY = chartRect.top + chartRect.height / 2;

    const dx = mouseX - centerX;
    const dy = mouseY - centerY;

    // JSCharting 레이더 차트는 12시 방향부터 시계방향으로 포인트를 배치
    // 각도 계산 (12시 방향을 0도로, 시계방향으로 증가)
    let angle = Math.atan2(dx, -dy); // 12시 방향이 0도가 되도록 dx, -dy 사용
    if (angle < 0) angle += 2 * Math.PI; // 0 ~ 2π 범위로 정규화

    // 현재 시간 기준으로 12개 시간대 생성 (과거 -> 현재 순서)
    const currentHour = new Date().getHours();
    const timeLabels = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setHours(currentHour - (11 - i)); // 11시간 전부터 현재까지
      return `${String(d.getHours()).padStart(2, '0')}:00`;
    });

    // 각도를 12개 구간으로 나누어 시간대 결정
    const segmentAngle = (2 * Math.PI) / 12;
    let timeIndex = Math.round(angle / segmentAngle) % 12;

    // 디버깅을 위한 로그
    console.log(
      `마우스 위치: (${mouseX}, ${mouseY}), 각도: ${(
        (angle * 180) /
        Math.PI
      ).toFixed(1)}도, 시간 인덱스: ${timeIndex}, 시간: ${
        timeLabels[timeIndex]
      }`
    );

    return timeLabels[timeIndex];
  }

  // DOM 변화를 감지하여 동적으로 이벤트 리스너 추가
  function setupDynamicEventListeners() {
    console.log('동적 이벤트 리스너 설정 시작');

    const chartContainer = document.getElementById('radarGraph');
    if (!chartContainer) {
      console.log('차트 컨테이너를 찾을 수 없습니다');
      return;
    }

    let hoverTimeout = null;

    // MutationObserver로 DOM 변화 감지
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // 새로운 SVG 요소들이 추가되면 이벤트 리스너 추가
          setupSVGEventListeners();
        }
      });
    });

    observer.observe(chartContainer, {
      childList: true,
      subtree: true,
    });

    // SVG 요소들에 직접 이벤트 리스너 추가
    function setupSVGEventListeners() {
      setTimeout(() => {
        // JSCharting이 생성하는 모든 가능한 요소들 찾기
        const svgElements = chartContainer.querySelectorAll(
          'circle, ellipse, path[stroke], g[class*="marker"], g[class*="point"]'
        );

        console.log('발견된 SVG 요소들:', svgElements.length);

        svgElements.forEach((element, index) => {
          // 기존 이벤트 리스너 제거 (중복 방지)
          element.removeEventListener('mouseenter', handleMouseEnter);
          element.removeEventListener('mouseleave', handleMouseLeave);

          // 새 이벤트 리스너 추가
          element.addEventListener('mouseenter', handleMouseEnter);
          element.addEventListener('mouseleave', handleMouseLeave);

          console.log(`이벤트 리스너 추가: ${element.tagName}[${index}]`);
        });
      }, 100);
    }

    function handleMouseEnter(e) {
      console.log(
        'SVG 요소 마우스 진입:',
        e.target.tagName,
        e.target.className
      );

      if (hoverTimeout) clearTimeout(hoverTimeout);

      hoverTimeout = setTimeout(() => {
        const chartRect = chartContainer.getBoundingClientRect();
        const timeLabel = getTimeFromPosition(e.clientX, e.clientY, chartRect);
        showTooltipModal(timeLabel, e.clientX, e.clientY);
      }, 50);

      // 마우스 움직임에 따라 모달 위치 업데이트
      const mouseMoveHandler = (moveEvent) => {
        if (isModalVisible) {
          const chartRect = chartContainer.getBoundingClientRect();
          const timeLabel = getTimeFromPosition(moveEvent.clientX, moveEvent.clientY, chartRect);
          showTooltipModal(timeLabel, moveEvent.clientX, moveEvent.clientY);
        }
      };

      element.addEventListener('mousemove', mouseMoveHandler);
      
      // 마우스가 벗어날 때 이벤트 리스너 제거
      element.addEventListener('mouseleave', function cleanup() {
        element.removeEventListener('mousemove', mouseMoveHandler);
        element.removeEventListener('mouseleave', cleanup);
      }, { once: true });
    }

    function handleMouseLeave(e) {
      console.log('SVG 요소 마우스 나감');
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hideTooltipModal();
    }

    // 초기 설정
    setupSVGEventListeners();

    // 차트 영역 전체에도 백업 이벤트 설정
    chartContainer.addEventListener('mouseleave', () => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hideTooltipModal();
    });

    console.log('동적 이벤트 리스너 설정 완료');
  }

  // 전체 차트 영역 기반 호버 감지 (최후의 수단)
  function setupFallbackEventListener() {
    console.log('백업 이벤트 리스너 설정');

    const chartContainer = document.getElementById('radarGraph');
    if (!chartContainer) return;

    let hoverTimeout = null;
    let lastTimeLabel = null;
    let isHovering = false;

    chartContainer.addEventListener('mousemove', (e) => {
      const chartRect = chartContainer.getBoundingClientRect();
      const centerX = chartRect.left + chartRect.width / 2;
      const centerY = chartRect.top + chartRect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // 차트 포인트 영역 근처에 있는지 확인
      const chartRadius =
        (Math.min(chartRect.width, chartRect.height) / 2) * 0.7;
      const minRadius = chartRadius * 0.6;
      const maxRadius = chartRadius * 1.1;

      if (distance >= minRadius && distance <= maxRadius) {
        isHovering = true;
        const timeLabel = getTimeFromPosition(e.clientX, e.clientY, chartRect);

        if (timeLabel !== lastTimeLabel) {
          lastTimeLabel = timeLabel;

          if (hoverTimeout) clearTimeout(hoverTimeout);

          hoverTimeout = setTimeout(() => {
            showTooltipModal(timeLabel, e.clientX, e.clientY);
            console.log('백업 이벤트로 호버 감지:', timeLabel);
          }, 100);
        } else if (isModalVisible) {
          // 같은 시간대에서 마우스가 움직일 때 모달 위치 업데이트
          showTooltipModal(timeLabel, e.clientX, e.clientY);
        }
      } else {
        if (isHovering) {
          isHovering = false;
          lastTimeLabel = null;
          if (hoverTimeout) clearTimeout(hoverTimeout);
          hideTooltipModal();
        }
      }
    });

    chartContainer.addEventListener('mouseleave', () => {
      isHovering = false;
      lastTimeLabel = null;
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hideTooltipModal();
    });
  }

  function initRadarChart() {
    const chartDom = document.getElementById('radarGraph');
    if (!chartDom) return;

    const sp = window.SelectedPoint;
    let radarData = [];
    let timeLabels = [];

    const hasValidData = sp?.gases?.NH3?.series?.length > 0;

    if (hasValidData) {
      const dataLength = sp.gases.NH3.series.length;
      timeLabels = Array.from({ length: dataLength }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (dataLength - 1 - i));
        return `${String(d.getHours()).padStart(2, '0')}:00`;
      });

      const getSafeSeries = (gasData, defaultValue = 1) => {
        return gasData?.series?.length > 0
          ? gasData.series
          : Array(dataLength).fill(defaultValue);
      };

      radarData = [
        {
          name: '암모니아(NH3)',
          points: getSafeSeries(sp.gases.NH3, 1).map((value, index) => [
            timeLabels[index],
            value,
          ]),
          color: '#5470c6',
        },
        {
          name: '황화수소(H2S)',
          points: getSafeSeries(sp.gases.H2S, 1).map((value, index) => [
            timeLabels[index],
            value,
          ]),
          color: '#92cc75',
        },
        {
          name: '메탄(CH4)',
          points: getSafeSeries(sp.gases.CH4, 1).map((value, index) => [
            timeLabels[index],
            value,
          ]),
          color: '#fdcb32',
        },
        {
          name: '이산화탄소(CO2)',
          points: getSafeSeries(sp.gases.CO2, 1).map((value, index) => [
            timeLabels[index],
            value,
          ]),
          color: '#fc4032',
        },
      ];
    } else {
      timeLabels = Array.from({ length: 12 }, (_, i) => {
        const d = new Date();
        d.setHours(d.getHours() - (11 - i));
        return `${String(d.getHours()).padStart(2, '0')}:00`;
      });

      const dummyData = [
        [2.1, 2.2, 2.0, 2.3, 2.4, 2.1, 2.0, 2.2, 2.3, 2.1, 2.2, 2.0],
        [0.8, 0.9, 0.7, 0.8, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.7, 0.8],
        [0.3, 0.4, 0.2, 0.3, 0.4, 0.3, 0.2, 0.3, 0.4, 0.3, 0.2, 0.3],
        [0.7, 0.8, 0.6, 0.7, 0.8, 0.7, 0.6, 0.7, 0.8, 0.7, 0.6, 0.7],
      ];

      const names = [
        '암모니아(NH3)',
        '황화수소(H2S)',
        '메탄(CH4)',
        '이산화탄소(CO2)',
      ];
      const colors = ['#5470c6', '#92cc75', '#fdcb32', '#fc4032'];

      radarData = names.map((name, i) => ({
        name: name,
        points: timeLabels.map((label, index) => [label, dummyData[i][index]]),
        color: colors[i],
      }));
    }

    try {
      radarChart = JSC.chart('radarGraph', {
        debug: false,
        type: 'radar spider',
        defaultCultureName: 'ko-KR',

        // 기본 툴팁 완전히 비활성화
        defaultPoint: {
          tooltip: false,
          marker_visible: true,
        },

        xAxis: {
          spacingPercentage: 0.05,
          defaultTick: {
            padding: 5,
            label_style: { fontFamily: 'Noto Sans KR' },
          },
          scale_type: 'auto',
          label_style: { fontFamily: 'Noto Sans KR' },
        },
        yAxis: {
          formatString: 'd',
          scale_range_min: 0,
          label_style: { fontFamily: 'Noto Sans KR' },
        },
        defaultSeries: {
          opacity: 0.7,
          line_width: 3,
        },
        series: radarData.map((data) => ({
          name: data.name,
          color: data.color,
          points: data.points,
          defaultPoint: {
            marker: {
              visible: true,
              size: 16, // 더 큰 마커로 호버하기 쉽게
              fill: '#fff',
              outline_width: 4,
              outline_color: data.color,
            },
          },
        })),
        width: '100%',
        height: '100%',
        chartArea: {
          margin: '10% 15% 15% 15%',
        },
        polar: { enabled: true },
        legend: {
          visible: true,
          position: 'top right',
          template: '%icon,%name',
          defaultEntry: {
            style: {
              fontFamily:
                'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto',
              fontSize: 12,
            },
          },
          margin: '10px 10px 0 0',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '1px solid #e5e5e6',
          borderRadius: '6px',
          padding: '8px 12px',
        },
      });

      console.log('JSCharting 레이더 차트 생성 완료');

      // 여러 방법으로 이벤트 리스너 설정
      setTimeout(() => {
        setupDynamicEventListeners(); // 동적 SVG 요소 감지
      }, 500);

      setTimeout(() => {
        setupFallbackEventListener(); // 전체 영역 기반 백업
      }, 1000);
    } catch (error) {
      console.error('JSCharting 차트 생성 중 에러:', error);
    }
  }

  // 전역 테스트 함수들
  window.testRadarModalAtMouse = function () {
    console.log('마우스를 움직여서 모달이 커서를 따라다니는지 테스트하세요');
    
    const testHandler = function(e) {
      showTooltipModal('14:00', e.clientX, e.clientY);
    };
    
    document.addEventListener('mousemove', testHandler);
    
    // 5초 후 테스트 종료
    setTimeout(() => {
      document.removeEventListener('mousemove', testHandler);
      hideTooltipModal();
      console.log('마우스 추적 테스트가 종료되었습니다');
    }, 5000);
  };

  window.debugChartElements = function () {
    const chartContainer = document.getElementById('radarGraph');
    if (!chartContainer) {
      console.log('차트 컨테이너를 찾을 수 없습니다');
      return;
    }

    console.log('=== 차트 요소 분석 ===');
    const allElements = chartContainer.querySelectorAll('*');
    console.log('전체 요소 수:', allElements.length);

    const svgElements = chartContainer.querySelectorAll('svg');
    console.log('SVG 요소 수:', svgElements.length);

    const circles = chartContainer.querySelectorAll('circle');
    console.log('Circle 요소 수:', circles.length);
    circles.forEach((circle, i) => {
      console.log(
        `Circle ${i}:`,
        circle.getAttribute('r'),
        circle.getAttribute('fill')
      );
    });

    const paths = chartContainer.querySelectorAll('path');
    console.log('Path 요소 수:', paths.length);

    const groups = chartContainer.querySelectorAll('g');
    console.log('Group 요소 수:', groups.length);

    return { allElements, svgElements, circles, paths, groups };
  };

  // 차트의 실제 시간 레이블과 각도 매핑 디버깅
  window.debugTimeMapping = function () {
    console.log('=== 시간 매핑 디버깅 ===');

    // 현재 차트에서 사용하는 시간 레이블들
    const currentHour = new Date().getHours();
    const timeLabels = Array.from({ length: 12 }, (_, i) => {
      const d = new Date();
      d.setHours(currentHour - (11 - i));
      return `${String(d.getHours()).padStart(2, '0')}:00`;
    });

    console.log('차트 시간 레이블들:', timeLabels);
    console.log('12시 방향:', timeLabels[0]);
    console.log('3시 방향:', timeLabels[3]);
    console.log('6시 방향:', timeLabels[6]);
    console.log('9시 방향:', timeLabels[9]);

    // 각 시간대별 각도 계산
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * 360;
      console.log(`시간 ${timeLabels[i]}: ${angle}도`);
    }

    // 클릭 테스트 가이드
    console.log('\n=== 클릭 테스트 가이드 ===');
    console.log(
      '차트의 12시 방향을 클릭해서 올바른 시간이 나오는지 확인하세요'
    );

    return timeLabels;
  };

  // 마우스 위치에서 실시간 시간 확인
  window.enableTimeDebug = function () {
    const chartContainer = document.getElementById('radarGraph');
    if (!chartContainer) {
      console.log('차트 컨테이너를 찾을 수 없습니다');
      return;
    }

    console.log('시간 디버그 모드 활성화 - 마우스를 움직여보세요');

    const handler = function (e) {
      const chartRect = chartContainer.getBoundingClientRect();
      const timeLabel = getTimeFromPosition(e.clientX, e.clientY, chartRect);
      console.log(`실시간 시간: ${timeLabel}`);
    };

    chartContainer.addEventListener('mousemove', handler);

    // 10초 후 자동 해제
    setTimeout(() => {
      chartContainer.removeEventListener('mousemove', handler);
      console.log('시간 디버그 모드 해제됨');
    }, 10000);
  };

  waitForJSCharting();
})();
