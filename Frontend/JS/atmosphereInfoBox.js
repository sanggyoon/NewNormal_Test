// 자세히보기 버튼 모달창 생성 -> 이제 쓰지 않는 코드인데 없애면 게이지가 사라짐...?? 급하지 않아서 나중에 수정
function attachAtmosphereModalEvents() {
  document.querySelectorAll('.dataBox_detailButton').forEach(function (btn) {
    btn.onclick = function () {
      const container = btn.closest('.atmosphereInfo_container');
      const modal = container.querySelector('.atmosphereDetailModal');
      if (modal) modal.style.display = 'block';

      const closeBtn = modal.querySelector('.close');
      closeBtn.onclick = function () {
        modal.style.display = 'none';
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
    };
  });
}
window.attachAtmosphereModalEvents = attachAtmosphereModalEvents;

// 데이터에서 상태 불러오기
function getGasState(value) {
  if (value === 0)
    return {
      text: '단절',
      btn_color: '#EAEAEB',
      text_color: '#7D7F82',
      background_color: '#F7F7F8',
      border_color: '#E5E5E6',
    };
  if (value > 0 && value <= 1)
    return {
      text: '정상',
      btn_color: '#E0EFFF',
      text_color: '#007BFE',
      background_color: '#F6FAFD',
      border_color: '#D0E7FF',
    };
  if (value > 1 && value <= 2)
    return {
      text: '경고',
      btn_color: '#fff7d1ff',
      text_color: '#FFD600',
      background_color: '#fffdf4ff',
      border_color: '#ffed92ff',
    };
  if (value > 2 && value <= 3)
    return {
      text: '고장',
      btn_color: '#FFE7E7',
      text_color: '#FF3737',
      background_color: '#FFF9F9',
      border_color: '#FFDEDE',
    };
  return {
    text: '보수중',
    btn_color: '#EAEAEB',
    text_color: '#7D7F82',
    background_color: 'white',
    border_color: '#E5E5E6',
  };
}

// 더미 데이터 적용
function applyDummyDataToAtmosphereBox(index, targetId) {
  const data = DummyData.items[index];
  const container = document.getElementById(targetId);

  if (!container) return;

  // 위치명
  container.querySelector('.atmosphereInfo_locationName span').textContent =
    data.farmsub;

  // 풍향
  container.querySelector('.atmosphere_wind span:nth-child(2)').textContent =
    data.windDirection;

  // 풍속
  container.querySelector('.atmosphere_wind span:nth-child(3)').textContent =
    data.windSpeed;

  // 온도
  container.querySelector(
    '.atmosphere_temperature span:nth-child(2)'
  ).textContent = data.avgTemp;

  // 습도
  container.querySelector(
    '.atmosphere_humidity span:nth-child(2)'
  ).textContent = data.avgHumid;

  // 암모니아
  const ammoniaState = getGasState(data.avg1);
  const ammoniaBox = container.querySelector('.ammoniaBox');
  ammoniaBox.querySelector('.gaseousState').textContent = ammoniaState.text;
  ammoniaBox.querySelector('.gaseousState').style.backgroundColor =
    ammoniaState.btn_color;
  ammoniaBox.querySelector('.gaseousState').style.color =
    ammoniaState.text_color;
  ammoniaBox.querySelector('.gaseousValue').textContent = data.avg1;
  ammoniaBox.querySelector('.gaseousValue').style.color =
    ammoniaState.text_color;
  ammoniaBox.style.backgroundColor = ammoniaState.background_color;
  ammoniaBox.style.borderColor = ammoniaState.border_color;

  // 황화수소
  const hydrogenState = getGasState(data.avg2);
  const hydrogenBox = container.querySelector('.hydrogenSulfideBox');
  hydrogenBox.querySelector('.gaseousState').textContent = hydrogenState.text;
  hydrogenBox.querySelector('.gaseousState').style.backgroundColor =
    hydrogenState.btn_color;
  hydrogenBox.querySelector('.gaseousState').style.color =
    hydrogenState.text_color;
  hydrogenBox.querySelector('.gaseousValue').textContent = data.avg2;
  hydrogenBox.querySelector('.gaseousValue').style.color =
    hydrogenState.text_color;
  hydrogenBox.style.backgroundColor = hydrogenState.background_color;
  hydrogenBox.style.borderColor = hydrogenState.border_color;

  // 메탄
  const methaneState = getGasState(data.avg3);
  const methaneBox = container.querySelector('.methaneBox');
  methaneBox.querySelector('.gaseousState').textContent = methaneState.text;
  methaneBox.querySelector('.gaseousState').style.backgroundColor =
    methaneState.btn_color;
  methaneBox.querySelector('.gaseousState').style.color =
    methaneState.text_color;
  methaneBox.querySelector('.gaseousValue').textContent = data.avg3;
  methaneBox.querySelector('.gaseousValue').style.color =
    methaneState.text_color;
  methaneBox.style.backgroundColor = methaneState.background_color;
  methaneBox.style.borderColor = methaneState.border_color;

  // 이산화탄소
  const co2State = getGasState(data.avg4);
  const co2Box = container.querySelector('.carbonDioxideBox');
  co2Box.querySelector('.gaseousState').textContent = co2State.text;
  co2Box.querySelector('.gaseousState').style.backgroundColor =
    co2State.btn_color;
  co2Box.querySelector('.gaseousState').style.color = co2State.text_color;
  co2Box.querySelector('.gaseousValue').textContent = data.avg4;
  co2Box.querySelector('.gaseousValue').style.color = co2State.text_color;
  co2Box.style.backgroundColor = co2State.background_color;
  co2Box.style.borderColor = co2State.border_color;
}

// 적용
window.applyAllAtmosphereDummyData = function () {
  applyDummyDataToAtmosphereBox(0, 'atmosphereInfoBox_id_0');
  applyDummyDataToAtmosphereBox(1, 'atmosphereInfoBox_id_1');
  applyDummyDataToAtmosphereBox(2, 'atmosphereInfoBox_id_2');
  applyDummyDataToAtmosphereBox(3, 'atmosphereInfoBox_id_3');
};

// 포인트별 상세보기 버튼 이벤트, 해당 데이터를 세션에 저장
function attachDetailButtonHandlers() {
  document.querySelectorAll('.dataBox_detailButton').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      const raw = DummyData.items[idx];
      const payload = {
        id: raw.id,
        farmname: raw.farmname,
        farmsub: raw.farmsub,
        wind: { dir: raw.windDirection, speed: raw.windSpeed },
        temp: { avg: raw.avgTemp, series: raw.temp },
        humid: { avg: raw.avgHumid, series: raw.humid },
        gases: {
          NH3: {
            avg: raw.avg1,
            max: raw.max1,
            series: raw.gas1,
            last: raw.gas1.at(-1),
          },
          H2S: {
            avg: raw.avg2,
            max: raw.max2,
            series: raw.gas2,
            last: raw.gas2.at(-1),
          },
          CH4: {
            avg: raw.avg3,
            max: raw.max3,
            series: raw.gas3,
            last: raw.gas3.at(-1),
          },
          CO2: {
            avg: raw.avg4,
            max: raw.max4,
            series: raw.gas4,
            last: raw.gas4.at(-1),
          },
        },
      };
      sessionStorage.setItem('selectedPoint', JSON.stringify(payload));
    });
  });
}
window.attachDetailButtonHandlers = attachDetailButtonHandlers;
