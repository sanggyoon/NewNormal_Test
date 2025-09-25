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

// 더미 데이터 적용 (기존 함수 유지)
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

  container.querySelector('.atmosphere_wind span:nth-child(2)').textContent = windDir;
  container.querySelector('.atmosphere_wind span:nth-child(3)').textContent = windSpeed;

  const windIcon = container.querySelector('.icon_windDirection');
  const angle = getWindDirectionAngle(windDir);
  windIcon.style.transform = `rotate(${angle}deg)`;

  // 위치명
  container.querySelector('.atmosphereInfo_locationName span').textContent = data.farmsub;

  // 온도
  container.querySelector('.atmosphere_temperature span:nth-child(2)').textContent = data.avgTemp;

  // 습도
  container.querySelector('.atmosphere_humidity span:nth-child(2)').textContent = data.avgHumid;

  // 기존 4개 가스 데이터 적용
  const gases = [
    { key: 'avg1', box: '.ammoniaBox' },
    { key: 'avg2', box: '.hydrogenSulfideBox' },
    { key: 'avg3', box: '.methaneBox' },
    { key: 'avg4', box: '.carbonDioxideBox' },
  ];

  gases.forEach(gas => {
    const gasState = getGasState(data[gas.key]);
    const gasBox = container.querySelector(gas.box);
    
    gasBox.querySelector('.gaseousState').textContent = gasState.text;
    gasBox.querySelector('.gaseousState').style.backgroundColor = gasState.btn_color;
    gasBox.querySelector('.gaseousState').style.color = gasState.text_color;
    gasBox.querySelector('.gaseousValue').textContent = data[gas.key];
    gasBox.querySelector('.gaseousValue').style.color = gasState.text_color;
    gasBox.style.backgroundColor = gasState.background_color;
    gasBox.style.borderColor = gasState.border_color;
  });
}

// daterangepicker 기능 (기존 유지)
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
          '1월', '2월', '3월', '4월', '5월', '6월',
          '7월', '8월', '9월', '10월', '11월', '12월',
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

// 가스 값 업데이트 (기존 유지)
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

// 버튼 클릭 이벤트 (기존 유지)
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

// 상세보기 버튼 이벤트 (기존 유지)
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
            value: container.querySelector('.ammoniaBox .gaseousValue').textContent,
            series: raw.gas1,
          },
          H2S: {
            value: container.querySelector('.hydrogenSulfideBox .gaseousValue').textContent,
            series: raw.gas2,
          },
          CH4: {
            value: container.querySelector('.methaneBox .gaseousValue').textContent,
            series: raw.gas3,
          },
          CO2: {
            value: container.querySelector('.carbonDioxideBox .gaseousValue').textContent,
            series: raw.gas4,
          },
        },
      };
      sessionStorage.setItem('selectedPoint', JSON.stringify(payload));
    });
  });
}
window.attachDetailButtonHandlers = attachDetailButtonHandlers;

// 기존 초기화 함수 (기존 유지)
window.applyAllAtmosphereDummyData = function () {
  DummyData.items.forEach((_, i) => {
    const targetId = `atmosphereInfoBox_id_${i}`;
    applyDummyDataToAtmosphereBox(i, targetId);
    updateGasValues(i, 0);
  });
  attachGasRangeButtonEvents();
  attachDatePickerApplyEvent();
  
  // 새로운 기능 초기화
  initializePaginationFeatures();
};

// === 새로운 페이징 및 관리 기능 ===

// 페이징 상태 관리
const atmospherePageState = {};

// 추가 가스 타입 정의
const ADDITIONAL_GAS_TYPES = [
  { key: 'gas5', name: '일산화탄소', className: 'carbonMonoxideBox', avgKey: 'avg5' },
  { key: 'gas6', name: '산소', className: 'oxygenBox', avgKey: 'avg6' },
  { key: 'gas7', name: '이산화질소', className: 'nitrogenDioxideBox', avgKey: 'avg7' },
  { key: 'gas8', name: '오존', className: 'ozoneBox', avgKey: 'avg8' },
];

// 페이징 기능 초기화
function initializePaginationFeatures() {
  DummyData.items.forEach((_, index) => {
    if (!atmospherePageState[index]) {
      atmospherePageState[index] = {
        currentPage: 0,
        itemsPerPage: 4,
        totalItems: 4, // 기본 4개
        maxItems: 8,   // 최대 8개
        allMeasurementData: [] // 모든 measurementData 저장
      };
      
      // 기본 4개 measurementData를 allMeasurementData에 저장
      const container = document.getElementById(`atmosphereInfoBox_id_${index}`);
      if (container) {
        const measurements = container.querySelectorAll('.measurementData');
        measurements.forEach(el => {
          atmospherePageState[index].allMeasurementData.push(el.cloneNode(true));
        });
      }
    }
    
    // 컨트롤 버튼 표시
    showControlButtons(index);
    // 초기 렌더링
    renderCurrentPage(index);
  });
}

// 컨트롤 버튼 표시/숨김
function showControlButtons(index) {
  const container = document.getElementById(`atmosphereInfoBox_id_${index}`);
  if (!container) return;
  
  const controls = container.querySelector('.measurementData_controls');
  const pagination = container.querySelector('.pagination_container');
  
  if (controls) controls.style.display = 'flex';
  updatePaginationVisibility(index);
}

// 페이징 네비게이션 표시/숨김
function updatePaginationVisibility(index) {
  const state = atmospherePageState[index];
  const container = document.getElementById(`atmosphereInfoBox_id_${index}`);
  if (!container) return;
  
  const pagination = container.querySelector('.pagination_container');
  if (pagination) {
    // 페이징은 항상 표시
    pagination.style.display = 'flex';
  }
  
  renderPaginationDots(index);
}

// 현재 페이지 요소들에 데이터 적용
function applyDataToCurrentPageElements(index, startIndex, endIndex) {
  const data = DummyData.items[index];
  const container = document.getElementById(`atmosphereInfoBox_id_${index}`);
  if (!container || !data) return;
  
  const currentElements = container.querySelectorAll('.dataBox_measurmentData .measurementData');
  
  currentElements.forEach((element, relativeIndex) => {
    const absoluteIndex = startIndex + relativeIndex;
    
    if (absoluteIndex < 4) {
      // 기본 4개 가스 데이터 적용
      const gasKeys = ['avg1', 'avg2', 'avg3', 'avg4'];
      const gasValue = data[gasKeys[absoluteIndex]] || 0;
      const gasState = getGasState(gasValue);
      
      // 상태 업데이트
      updateElementWithGasData(element, gasState, gasValue);
    } else {
      // 추가 가스 데이터 적용
      const additionalIndex = absoluteIndex - 4;
      if (additionalIndex < ADDITIONAL_GAS_TYPES.length) {
        const gasType = ADDITIONAL_GAS_TYPES[additionalIndex];
        const gasValue = parseFloat(data[gasType.avgKey] || 0);
        const gasState = getGasState(gasValue);
        
        updateElementWithGasData(element, gasState, gasValue);
      }
    }
  });
}

// 요소에 가스 데이터 적용
function updateElementWithGasData(element, gasState, gasValue) {
  element.querySelector('.gaseousState').textContent = gasState.text;
  element.querySelector('.gaseousState').style.backgroundColor = gasState.btn_color;
  element.querySelector('.gaseousState').style.color = gasState.text_color;
  element.querySelector('.gaseousValue').textContent = gasValue;
  element.querySelector('.gaseousValue').style.color = gasState.text_color;
  element.style.backgroundColor = gasState.background_color;
  element.style.borderColor = gasState.border_color;
}

// measurementData 렌더링
function renderCurrentPage(index) {
  const state = atmospherePageState[index];
  const container = document.getElementById(`atmosphereInfoBox_id_${index}`);
  if (!container) return;
  
  const dataContainer = container.querySelector('.dataBox_measurmentData');
  if (!dataContainer) return;
  
  // 현재 페이지의 요소들 계산
  const startIndex = state.currentPage * state.itemsPerPage;
  const endIndex = Math.min(startIndex + state.itemsPerPage, state.totalItems);
  
  // 모든 measurementData 요소 제거
  dataContainer.innerHTML = '';
  
  // 현재 페이지에 해당하는 요소들만 추가
  for (let i = startIndex; i < endIndex; i++) {
    if (state.allMeasurementData[i]) {
      const clonedElement = state.allMeasurementData[i].cloneNode(true);
      dataContainer.appendChild(clonedElement);
    }
  }
  
  // 데이터 적용 (현재 페이지의 요소들에 대해)
  applyDataToCurrentPageElements(index, startIndex, endIndex);
}

// 페이징 도트 렌더링
function renderPaginationDots(index) {
  const state = atmospherePageState[index];
  const container = document.getElementById(`atmosphereInfoBox_id_${index}`);
  if (!container) return;
  
  const dotsContainer = container.querySelector('.pagination_dots');
  if (!dotsContainer) return;
  
  dotsContainer.innerHTML = '';
  
  const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
  
  for (let i = 0; i < totalPages; i++) {
    const dot = document.createElement('div');
    dot.className = 'pagination_dot';
    if (i === state.currentPage) {
      dot.classList.add('active');
    }
    
    dot.addEventListener('click', () => goToPage(index, i));
    dotsContainer.appendChild(dot);
  }
  
  // 네비게이션 버튼 상태 업데이트
  updateNavigationButtons(index, totalPages);
}

// 페이지 변경
function changePage(index, direction) {
  const state = atmospherePageState[index];
  const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
  
  let newPage = state.currentPage + direction;
  
  if (newPage < 0) newPage = 0;
  if (newPage >= totalPages) newPage = totalPages - 1;
  
  if (newPage !== state.currentPage) {
    state.currentPage = newPage;
    renderCurrentPage(index);
    renderPaginationDots(index);
  }
}

// 특정 페이지로 이동
function goToPage(index, pageNumber) {
  const state = atmospherePageState[index];
  const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
  
  if (pageNumber >= 0 && pageNumber < totalPages && pageNumber !== state.currentPage) {
    state.currentPage = pageNumber;
    renderCurrentPage(index);
    renderPaginationDots(index);
  }
}

// 네비게이션 버튼 상태 업데이트
function updateNavigationButtons(index, totalPages) {
  const container = document.getElementById(`atmosphereInfoBox_id_${index}`);
  if (!container) return;
  
  const prevBtn = container.querySelector('.pagination_nav.prev');
  const nextBtn = container.querySelector('.pagination_nav.next');
  const state = atmospherePageState[index];
  
  if (prevBtn) {
    prevBtn.disabled = state.currentPage === 0;
  }
  
  if (nextBtn) {
    nextBtn.disabled = state.currentPage >= totalPages - 1;
  }
}

// measurementData 추가 기능
function addMeasurementData(index) {
  const state = atmospherePageState[index];
  
  if (state.totalItems >= state.maxItems) {
    alert(`최대 ${state.maxItems}개의 측정 데이터까지 추가할 수 있습니다.`);
    return;
  }
  
  const additionalGasIndex = state.totalItems - 4; // 기본 4개 제외
  if (additionalGasIndex >= ADDITIONAL_GAS_TYPES.length) {
    alert('더 이상 추가할 수 있는 가스 타입이 없습니다.');
    return;
  }
  
  const gasType = ADDITIONAL_GAS_TYPES[additionalGasIndex];
  
  // 더미 데이터에 새 가스 추가
  const data = DummyData.items[index];
  if (!data[gasType.key]) {
    data[gasType.key] = Array(12).fill().map(() => (Math.random() * 3).toFixed(1));
    data[gasType.avgKey] = (Math.random() * 3).toFixed(1);
  }
  
  // 새 measurementData 요소 생성
  const newElement = createMeasurementDataElement(index, gasType);
  state.allMeasurementData.push(newElement);
  state.totalItems++;
  
  // 페이징 및 렌더링 업데이트
  updatePaginationVisibility(index);
  renderCurrentPage(index);
}

// measurementData 삭제 기능
function deleteMeasurementData(index) {
  const state = atmospherePageState[index];
  
  if (state.totalItems <= 1) {
    alert('최소 1개의 측정 데이터는 유지되어야 합니다.');
    return;
  }
  
  // 마지막 요소 제거
  state.allMeasurementData.pop();
  state.totalItems--;
  
  // 현재 페이지가 범위를 벗어나면 조정
  const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
  if (state.currentPage >= totalPages) {
    state.currentPage = Math.max(0, totalPages - 1);
  }
  
  // 페이징 및 렌더링 업데이트
  updatePaginationVisibility(index);
  renderCurrentPage(index);
}

// measurementData 요소 생성
function createMeasurementDataElement(index, gasType) {
  const div = document.createElement('div');
  div.className = `measurementData ${gasType.className}`;
  
  const data = DummyData.items[index];
  const gasValue = parseFloat(data[gasType.avgKey] || 0);
  const gasState = getGasState(gasValue);
  
  div.innerHTML = `
    <div class="gaseousState" style="background-color: ${gasState.btn_color}; color: ${gasState.text_color};">${gasState.text}</div>
    <div class="voidBox"></div>
    <div class="gaugeGraph">
      <canvas id="${gasType.key}Gauge_${index}"></canvas>
    </div>
    <div class="voidBox"></div>
    <div class="gaseousValue" style="color: ${gasState.text_color};">${gasValue}</div>
    <div class="gaseousName">${gasType.name}</div>
  `;
  
  // 스타일 적용
  div.style.backgroundColor = gasState.background_color;
  div.style.borderColor = gasState.border_color;
  
  return div;
}

// 전역 함수로 등록
window.changePage = changePage;
window.addMeasurementData = addMeasurementData;
window.deleteMeasurementData = deleteMeasurementData;
