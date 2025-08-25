(function () {
  const sp = window.SelectedPoint;
  const useClean = !!(sp && sp.temp && sp.humid);

  // 라벨 (오래된 → 최신)
  const labels =
    useClean && sp.temp.series?.length
      ? Array.from({ length: sp.temp.series.length }, (_, i) => {
          const d = new Date();
          d.setHours(d.getHours() - (sp.temp.series.length - 1 - i));
          return `${String(d.getHours()).padStart(2, '0')}:00`;
        })
      : Array.from({ length: 12 }, (_, i) => {
          const d = new Date();
          d.setHours(d.getHours() - (11 - i));
          return `${String(d.getHours()).padStart(2, '0')}:00`;
        });

  // ------------------ 온도 그래프 ------------------
  // 온도 범위 계산
  let tempMin = 0,
    tempMax = 50;
  if (useClean) {
    tempMin = Math.min(...sp.temp.series);
    tempMax = Math.max(...sp.temp.series);
    const margin = (tempMax - tempMin) * 0.2 || 1;
    tempMin -= margin;
    tempMax += margin;
  }

  const ctxTemp = document.getElementById('temperatureGraph');
  new Chart(ctxTemp, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '온도',
          data: useClean
            ? sp.temp.series
            : [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          borderWidth: 2,
          borderColor: '#FF5384',
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
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
          min: tempMin,
          max: tempMax,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    },
  });

  // ------------------ 습도 그래프 ------------------
  // 습도 범위 계산
  let humidMin = 0,
    humidMax = 100;
  if (useClean) {
    humidMin = Math.min(...sp.humid.series);
    humidMax = Math.max(...sp.humid.series);
    const margin = (humidMax - humidMin) * 0.2 || 1;
    humidMin -= margin;
    humidMax += margin;
  }

  const ctxHumid = document.getElementById('humidityGraph');
  new Chart(ctxHumid, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '습도',
          data: useClean
            ? sp.humid.series
            : [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
          borderWidth: 2,
          borderColor: '#36A2EB',
        },
      ],
    },
    options: {
      plugins: {
        legend: { display: false },
        customTitleLegend: {
          display: true,
          title: '시간별 습도',
          labels: ['습도'],
          colors: ['#36A2EB'],
        },
      },
      layout: {
        padding: {
          top: 40,
        },
      },
      scales: {
        y: {
          min: humidMin,
          max: humidMax,
        },
      },
      elements: {
        point: {
          radius: 0,
        },
      },
    },
  });
})();
