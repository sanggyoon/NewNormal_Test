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
    NH3: data.gases.NH3.avg,
    H2S: data.gases.H2S.avg,
    CH4: data.gases.CH4.avg,
    CO2: data.gases.CO2.avg,
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
  });
}
if (window.SelectedPoint) {
  window.addEventListener('load', () => {
    setTimeout(renderGaugesFromSelectedPoint, 300);
  });
}

// 각 박스별 더미값 적용
if (typeof DummyData !== 'undefined' && DummyData.items) {
  for (let i = 0; i < 4; i++) {
    const data = DummyData.items[i];
    // 암모니아
    document.querySelectorAll(`#ammoniaGauge_${i}`).forEach((canvas) => {
      const [startColor, stopColor] = getGradientByValue(data.avg1, 3.0);
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
      gauge.set(data.avg1);
    });

    // 황화수소
    document
      .querySelectorAll(`#hydrogenSulfideGauge_${i}`)
      .forEach((canvas) => {
        const [startColor, stopColor] = getGradientByValue(data.avg2, 3.0);
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
        gauge.set(data.avg2);
      });

    // 메탄
    document.querySelectorAll(`#methaneGauge_${i}`).forEach((canvas) => {
      const [startColor, stopColor] = getGradientByValue(data.avg3, 3.0);
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
      gauge.set(data.avg3);
    });

    // 이산화탄소
    document.querySelectorAll(`#carbonDioxideGauge_${i}`).forEach((canvas) => {
      const [startColor, stopColor] = getGradientByValue(data.avg4, 3.0);
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
      gauge.set(data.avg4);
    });
  }
}

if (window.SelectedPoint && location.pathname.includes('devicePointIndex')) {
  renderGaugesFromSelectedPoint();
}
