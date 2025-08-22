// devicePointIndex.html 내에서 컴포넌트 로딩 후 실행
// .atmosphereInfo_dataBox의 높이를 가져와서 .probability_mapBox의 높이로 설정
// Promise.all([
//   loadComponent('Components/atmosphereBox.html', 'atmosphereInfoBox_id_1'),
//   loadComponent('Components/probabilityBox.html', 'probabilityBox'),
// ]).then(() => {
//   const atmosphereBox = document.querySelector('.atmosphereInfo_dataBox');
//   const radarGraphBoxes = document.querySelectorAll('.radarGraphBox');
//   if (atmosphereBox && radarGraphBoxes.length > 0) {
//     const height = atmosphereBox.offsetHeight;
//     radarGraphBoxes.forEach((box) => {
//       box.style.height = height + 'px';
//     });
//   }
// });

// radarGraph 그리기
const ctx2 = document.getElementById('radarGraph');

new Chart(ctx2, {
  type: 'radar',
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
    // scales: {
    //   y: {
    //     beginAtZero: true,
    //     grid: {
    //       display: false,
    //     },
    //   },
    // },
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
        const { ctx2, chartArea } = chart;
        if (!chartArea || chartArea.width === 0) return;

        ctx2.save();
        ctx2.font = '700 20px Pretendard';
        ctx2.textBaseline = 'top';
        ctx2.fillStyle = '#333';
        // Title
        const titleX = -25;
        const titleY = 0;
        ctx2.fillText(
          options.title,
          chartArea.left + titleX,
          chartArea.top - chartArea.top + titleY
        );

        Legend(inline);
        let x =
          chartArea.left + titleX + ctx2.measureText(options.title).width + 20;
        const y = chartArea.top - chartArea.top + titleY;
        options.labels.forEach((label, i) => {
          // 색상 박스
          ctx2.fillStyle = options.colors[i];
          ctx2.fillRect(x, y + 5, 14, 14);
          x += 18;
          // 라벨
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
