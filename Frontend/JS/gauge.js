function getGradientByValue(value, maxValue) {
  if (value <= 1) {
    return ['#007BFE', '#007BFE']; // 파란색
  } else if (value > 1 && value <= 2) {
    return ['#FFD600', '#FFD600']; // 노란색
  } else {
    return ['#EE5253', '#EE5253']; // 빨간색
  }
}

// 게이지 렌더링
function renderGaugesFromSelectedPoint() {
  if (!window.SelectedPoint) return;

  const data = window.SelectedPoint;

  const gases = {
    NH3: data.gases.NH3.value,
    H2S: data.gases.H2S.value,
    CH4: data.gases.CH4.value,
    CO2: data.gases.CO2.value,
  };

  const idMap = {
    NH3: 'ammoniaGauge_{{index}}',
    H2S: 'hydrogenSulfideGauge_{{index}}',
    CH4: 'methaneGauge_{{index}}',
    CO2: 'carbonDioxideGauge_{{index}}',
  };

  Object.entries(gases).forEach(([key, value]) => {
    const canvas = document.getElementById(idMap[key]);
    if (!canvas) return;

    // 이미 생성된 게이지가 있으면 재사용
    if (window._gaugeStore && window._gaugeStore[idMap[key]]) {
      const existingGauge = window._gaugeStore[idMap[key]];
      const [startColor, stopColor] = getGradientByValue(value, 3.0);
      existingGauge.options.colorStart = startColor;
      existingGauge.options.colorStop = stopColor;
      existingGauge.set(value);
      return;
    }

    const [startColor, stopColor] = getGradientByValue(value, 3.0);
    const opts = {
      angle: 0.12,
      lineWidth: 0.44,
      radiusScale: 1,
      pointer: {
        length: 0.62,
        strokeWidth: 0.08,
        color: '#000000',
      },
      limitMax: false,
      limitMin: false,
      strokeColor: '#E0E0E0',
      generateGradient: true,
      highDpiSupport: true,
      colorStart: startColor,
      colorStop: stopColor,
    };
    const gauge = new Gauge(canvas).setOptions(opts);
    gauge.maxValue = 3.0;
    gauge.setMinValue(0);
    gauge.animationSpeed = 128;
    gauge.set(value);
    
    // 게이지 저장소에 보관
    if (!window._gaugeStore) window._gaugeStore = {};
    window._gaugeStore[idMap[key]] = gauge;
  });
}

// devicePointIndex 페이지에서만 로드 후 렌더링 (한 번만)
if (window.SelectedPoint && location.pathname.includes('devicePointIndex')) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGaugesFromSelectedPoint);
  } else {
    renderGaugesFromSelectedPoint();
  }
}

// 대시보드 페이지의 게이지는 atmosphereInfoBox.js에서 관리
// (중복 초기화 방지를 위해 여기서는 초기화하지 않음)


// 전역 게이지 저장소 및 초기화 플래그
window._gaugeStore = window._gaugeStore || {};
window._gaugeInitialized = window._gaugeInitialized || false;

// id로 게이지 생성/업데이트
function getOrCreateGaugeById(canvasId, value) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const [startColor, stopColor] = getGradientByValue(value, 3.0);

  // 최초 생성
  if (!window._gaugeStore[canvasId]) {
    const opts = {
      angle: 0.12,
      lineWidth: 0.44,
      radiusScale: 1,
      pointer: { length: 0.62, strokeWidth: 0.08, color: '#000000' },
      limitMax: false,
      limitMin: false,
      strokeColor: '#E0E0E0',
      generateGradient: true,
      highDpiSupport: true,
      colorStart: startColor,
      colorStop: stopColor,
    };
    const gauge = new Gauge(canvas).setOptions(opts);
    gauge.maxValue = 3.0;
    gauge.setMinValue(0);
    gauge.animationSpeed = 128;
    window._gaugeStore[canvasId] = gauge;
  }

  // 값/색 갱신
  const gauge = window._gaugeStore[canvasId];
  gauge.options.colorStart = startColor;
  gauge.options.colorStop = stopColor;
  gauge.set(value);
  return gauge;
}

// 더미데이터의 특정 기간(gasIdx)로 해당 박스(index)의 4개 가스 게이지를 일괄 갱신
window.updateGaugesByGasIndex = function (index, gasIdx) {
  if (typeof DummyData === 'undefined' || !DummyData.items) return;
  const data = DummyData.items[index];

  const v1 = data.gas1[gasIdx] ?? 0; // NH3
  const v2 = data.gas2[gasIdx] ?? 0; // H2S
  const v3 = data.gas3[gasIdx] ?? 0; // CH4
  const v4 = data.gas4[gasIdx] ?? 0; // CO2

  getOrCreateGaugeById(`ammoniaGauge_${index}`, v1);
  getOrCreateGaugeById(`hydrogenSulfideGauge_${index}`, v2);
  getOrCreateGaugeById(`methaneGauge_${index}`, v3);
  getOrCreateGaugeById(`carbonDioxideGauge_${index}`, v4);
};
