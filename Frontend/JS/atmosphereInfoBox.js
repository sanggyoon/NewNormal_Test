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
      btn_color: '#FCF3DB',
      text_color: '#FF9900',
      background_color: '#FCFBF7',
      border_color: '#F7E4BA',
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

  // 풍향 아이콘 회전
  function getWindDirectionAngle(direction) {
    const map = {
      동풍: 180,
      남동풍: 225,
      남풍: 270,
      남서풍: 315,
      서풍: 0,
      북서풍: 45,
      북풍: 90,
      북동풍: 135,
    };
    return map[direction] ?? 0;
  }

  const windDir = data.windDirection;
  const windSpeed = data.windSpeed;

  container.querySelector('.atmosphere_wind span:nth-child(2)').textContent =
    windDir;
  container.querySelector('.atmosphere_wind span:nth-child(3)').textContent =
    windSpeed;

  const windIcon = container.querySelector('.icon_windDirection');
  const angle = getWindDirectionAngle(windDir);
  windIcon.style.transform = `rotate(${angle}deg)`;

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

// daterangepicker의 '확인' 버튼을 누르면 [4]번째 데이터로 업데이트
function attachDatePickerApplyEvent() {
  const input = document.getElementById('statusBar_choiceDate');
  if (!input) return;

  $(input).daterangepicker(
    {
      opens: 'left',
      locale: {
        format: 'YYYY/MM/DD',
        applyLabel: '확인',
        cancelLabel: '취소',
        daysOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
        monthNames: [
          '1월',
          '2월',
          '3월',
          '4월',
          '5월',
          '6월',
          '7월',
          '8월',
          '9월',
          '10월',
          '11월',
          '12월',
        ],
        firstDay: 0,
      },
    },
    function (start, end, label) {
      DummyData.items.forEach((_, i) => {
        updateGasValues(i, 4);
      });
    }
  );
}
window.attachDatePickerApplyEvent = attachDatePickerApplyEvent;

// 선택된 기간 인덱스를 기준으로 해당 가스값을 업데이트하는 함수 -> 버튼 클릭시 [0], [1], [2], [3]번쨰 값 정해진 값이 나오는 하드 코딩
function updateGasValues(index, gasIdx) {
  const data = DummyData.items[index];
  const container = document.getElementById(`atmosphereInfoBox_id_${index}`);
  if (!container) return;

  const gases = [
    { key: 'gas1', box: 'ammoniaBox' },
    { key: 'gas2', box: 'hydrogenSulfideBox' },
    { key: 'gas3', box: 'methaneBox' },
    { key: 'gas4', box: 'carbonDioxideBox' },
  ];

  gases.forEach((gas, i) => {
    const value = data[gas.key][gasIdx] ?? 0;
    const state = getGasState(value);
    const box = container.querySelector(`.${gas.box}`);
    box.querySelector('.gaseousState').textContent = state.text;
    box.querySelector('.gaseousState').style.backgroundColor = state.btn_color;
    box.querySelector('.gaseousState').style.color = state.text_color;
    box.querySelector('.gaseousValue').textContent = value;
    box.querySelector('.gaseousValue').style.color = state.text_color;
    box.style.backgroundColor = state.background_color;
    box.style.borderColor = state.border_color;
  });

  if (window.updateGaugesByGasIndex) {
    window.updateGaugesByGasIndex(index, gasIdx);
  }
}

// 버튼 클릭시 가스 값 업데이트
function attachGasRangeButtonEvents() {
  document.querySelectorAll('.quick-range-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const range = btn.getAttribute('data-range');
      const idxMap = { day: 0, week: 1, month: 2, year: 3 };
      const gasIndex = idxMap[range] ?? 0;

      DummyData.items.forEach((_, i) => {
        updateGasValues(i, gasIndex);
      });
    });
  });
}
window.attachGasRangeButtonEvents = attachGasRangeButtonEvents;

window.applyAllAtmosphereDummyData = function () {
  DummyData.items.forEach((_, i) => {
    const targetId = `atmosphereInfoBox_id_${i}`;
    applyDummyDataToAtmosphereBox(i, targetId);
    updateGasValues(i, 0);
  });
  attachGasRangeButtonEvents();
  attachDatePickerApplyEvent();
};

// 포인트별 상세보기 버튼 이벤트, 해당 데이터를 세션에 저장
function attachDetailButtonHandlers() {
  document.querySelectorAll('.dataBox_detailButton').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-index'));
      const raw = DummyData.items[idx];
      const container = document.getElementById(`atmosphereInfoBox_id_${idx}`);
      const payload = {
        id: raw.id,
        farmname: raw.farmname,
        farmsub: raw.farmsub,
        wind: { dir: raw.windDirection, speed: raw.windSpeed },
        temp: { avg: raw.avgTemp, series: raw.temp },
        humid: { avg: raw.avgHumid, series: raw.humid },
        gases: {
          NH3: {
            value: container.querySelector('.ammoniaBox .gaseousValue')
              .textContent, // [ADD]
            series: raw.gas1,
          },
          H2S: {
            value: container.querySelector('.hydrogenSulfideBox .gaseousValue')
              .textContent,
            series: raw.gas2,
          },
          CH4: {
            value: container.querySelector('.methaneBox .gaseousValue')
              .textContent,
            series: raw.gas3,
          },
          CO2: {
            value: container.querySelector('.carbonDioxideBox .gaseousValue')
              .textContent,
            series: raw.gas4,
          },
        },
      };
      sessionStorage.setItem('selectedPoint', JSON.stringify(payload));
    });
  });
}
window.attachDetailButtonHandlers = attachDetailButtonHandlers;
