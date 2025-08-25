(function () {
  const ctx2 = document.getElementById('radarGraph');
  const sp = window.SelectedPoint;
  const useClean = !!(sp && sp.gases);

  // 라벨
  const radarLabels =
    useClean && sp?.gases?.NH3?.series?.length
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

  const radarDatasets = useClean
    ? [
        {
          label: '암모니아',
          data: sp.gases.NH3.series,
          borderWidth: 2,
          borderColor: '#FF6384',
        },
        {
          label: '황화수소',
          data: sp.gases.H2S.series,
          borderWidth: 2,
          borderColor: '#36A2EB',
        },
        {
          label: '메탄',
          data: sp.gases.CH4.series,
          borderWidth: 2,
          borderColor: '#FFCE56',
        },
        {
          label: '이산화탄소',
          data: sp.gases.CO2.series,
          borderWidth: 2,
          borderColor: '#4BC0C0',
        },
      ]
    : [
        {
          label: '암모니아',
          data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          borderWidth: 2,
          borderColor: '#FF6384',
        },
        {
          label: '황화수소',
          data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          borderWidth: 2,
          borderColor: '#36A2EB',
        },
        {
          label: '메탄',
          data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          borderWidth: 2,
          borderColor: '#FFCE56',
        },
        {
          label: '이산화탄소',
          data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
          borderWidth: 2,
          borderColor: '#4BC0C0',
        },
      ];

  new Chart(ctx2, {
    type: 'radar',
    data: { labels: radarLabels, datasets: radarDatasets },
    options: {
      plugins: {
        title: { display: false },
        legend: { display: false },
        customTitleLegendRadar: {
          display: false,
        },
      },
      layout: { padding: { top: 40 } },
      elements: { point: { radius: 0 } },
    },
    plugins: [
      {
        id: 'customTitleLegendRadar',
        afterDraw(chart) {
          const options = chart.options.plugins.customTitleLegendRadar;
          if (!options || !options.display) return;
          const { ctx, chartArea } = chart;
          if (!chartArea || chartArea.width === 0) return;
          const ctx2 = ctx;
          ctx2.save();

          ctx2.save();
          ctx2.font = '700 20px Pretendard';
          ctx2.textBaseline = 'top';
          ctx2.fillStyle = '#333';

          const titleX = -25;
          const titleY = 0;
          ctx2.fillText(
            options.title,
            chartArea.left + titleX,
            chartArea.top - chartArea.top + titleY
          );

          let x =
            chartArea.left +
            titleX +
            ctx2.measureText(options.title).width +
            20;
          const y = chartArea.top - chartArea.top + titleY;

          options.labels.forEach((label, i) => {
            ctx2.fillStyle = options.colors[i];
            ctx2.fillRect(x, y + 5, 14, 14);
            x += 18;
            ctx2.fillStyle = '#333';
            ctx2.font = '14px pretendard';
            ctx2.fillText(label, x, y + 3);
            x += ctx2.measureText(label).width + 18;
          });

          ctx2.restore();
        },
      },
    ],
  });
})();
