// Temperature and Humidity Graphs
const ctx3 = document.getElementById('temperatureGraph');
new Chart(ctx3, {
  type: 'line',
  data: {
    labels: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (11 - i));
      return `${date.getHours()}:00`;
    }),
    datasets: [
      {
        label: '온도',
        data: [22, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
        borderWidth: 2,
        borderColor: '#FF5384',
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
        title: '시간별 온도',
        labels: ['온도'],
        colors: ['#FF5384'],
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
      },
    },
  },
});

// Temperature Graph
const ctx4 = document.getElementById('humidityGraph');
new Chart(ctx4, {
  type: 'line',
  data: {
    labels: Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (11 - i));
      return `${date.getHours()}:00`;
    }),
    datasets: [
      {
        label: '습도',
        data: [50, 52, 54, 53, 51, 49, 48, 47, 46, 45, 44, 43],
        borderWidth: 2,
        borderColor: '#36A2EB',
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
        title: '시간별 습도',
        labels: ['습도'],
        colors: ['#FF5384'],
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
      },
    },
  },
});
