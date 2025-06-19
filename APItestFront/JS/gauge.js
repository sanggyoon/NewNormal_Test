var opts = {
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
  colorStart: '#007BFE',
  colorStop: '#007BFE',
  strokeColor: '#E0E0E0',
  generateGradient: true,
  highDpiSupport: true,
};

// 여러 개의 gauge를 모두 초기화
[
  'ammoniaGauge',
  'hydrogenSulfideGauge',
  'methaneGauge',
  'carbonDioxideGauge',
].forEach(function (gaugeId) {
  // 여러 개 있을 수 있으니 querySelectorAll 사용
  document
    .querySelectorAll('canvas[id^="' + gaugeId + '"]')
    .forEach(function (canvas) {
      var gauge = new Gauge(canvas).setOptions(opts);
      gauge.maxValue = 3000;
      gauge.setMinValue(0);
      gauge.animationSpeed = 60;
      gauge.set(0);
    });
});
