function getGradientByValue(value, maxValue) {
  const percent = value / maxValue;
  if (percent < 0.5) {
    return ['#EE5253'];
  } else {
    return ['#007BFE'];
  }
}

// Gauge ID별 초기 값 예시 (사용자 정의 가능)
const gaugeValues = {
  ammoniaGauge: 500,
  hydrogenSulfideGauge: 1200,
  methaneGauge: 2200,
  carbonDioxideGauge: 1500,
};

Object.entries(gaugeValues).forEach(([gaugeId, value]) => {
  document.querySelectorAll(`canvas[id^="${gaugeId}"]`).forEach((canvas) => {
    const [startColor, stopColor] = getGradientByValue(value, 3000);

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
    gauge.maxValue = 3000;
    gauge.setMinValue(0);
    gauge.animationSpeed = 100;
    gauge.set(value);
  });
});
