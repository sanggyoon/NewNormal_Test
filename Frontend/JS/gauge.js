function getGradientByValue(value, maxValue) {
  if (value <= 1) {
    return ['#007BFE', '#007BFE']; // 파란색
  } else if (value > 1 && value <= 2) {
    return ['#FFD600', '#FFD600']; // 노란색
  } else {
    return ['#EE5253', '#EE5253']; // 빨간색
  }
}

// 각 박스별 더미값 적용
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
  document.querySelectorAll(`#hydrogenSulfideGauge_${i}`).forEach((canvas) => {
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
