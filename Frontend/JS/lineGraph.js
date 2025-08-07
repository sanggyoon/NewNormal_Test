const ctx = document.getElementById('timeLineChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (11 - i));
      return `${date.getHours()}:00`;
    }),
    datasets: [
      {
        label: '암모니아',
        data: [12, 19, 3, 5, 2, 3, 1, 4, 6, 8, 10, 12],
        borderWidth: 2,
        borderColor: '#FF6384',
      },
      {
        label: '황화수소',
        data: [20, 18, 4, 2, 1, 4, 5, 10, 7, 4, 9, 10],
        borderWidth: 2,
        borderColor: '#36A2EB',
      },
      {
        label: '메탄',
        data: [10, 15, 5, 7, 3, 6, 8, 2, 10, 11, 8, 13],
        borderWidth: 2,
        borderColor: '#FFCE56',
      },
      {
        label: '이산화탄소',
        data: [15, 10, 8, 6, 4, 2, 1, 5, 5, 7, 12, 11],
        borderWidth: 2,
        borderColor: '#4BC0C0',
      },
    ],
  },
  options: {
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: false,
      },
      customTitleLegend: {
        display: true,
        title: '시간별 추이',
        labels: ['암모니아', '황화수소', '메탄', '이산화탄소'],
        colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    },
    layout: {
      padding: {
        top: 40,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
      },
    },
  },
  plugins: [
    {
      id: 'customTitleLegend',
      afterDraw(chart) {
        const options = chart.options.plugins.customTitleLegend;
        if (!options || !options.display) return;
        const { ctx, chartArea } = chart;
        if (!chartArea || chartArea.width === 0) return;

        ctx.save();
        ctx.font = '700 20px Pretendard';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#333';
        // Title
        const titleX = -25;
        const titleY = 0;
        ctx.fillText(
          options.title,
          chartArea.left + titleX,
          chartArea.top - chartArea.top + titleY
        );

        // Legend (inline)
        let x =
          chartArea.left + titleX + ctx.measureText(options.title).width + 20;
        const y = chartArea.top - chartArea.top + titleY;
        options.labels.forEach((label, i) => {
          // 색상 박스
          ctx.fillStyle = options.colors[i];
          ctx.fillRect(x, y + 5, 14, 14);
          x += 18;
          // 라벨
          ctx.fillStyle = '#333';
          ctx.font = '14px pretendard';
          ctx.fillText(label, x, y + 3);
          x += ctx.measureText(label).width + 18;
        });
        ctx.restore();
      },
    },
  ],
});
