// JS/rawDataBox.js
// Raw Data 테이블 렌더 + API 연동 (CORS 허용 전제: 서버가 ACAO 헤더를 반환해야 함)

// ====== API 엔드포인트 & 파라미터 ======
const RAW_API = {
  // CORS 우회를 위한 PHP 프록시 사용 (절대 경로)
  proxy: 'http://localhost:8000/api_proxy.php', // 로컬 PHP 프록시
  // 원본 API (참고용)
  // base: 'https://lssatdk2.cafe24.com',
  // main: '/test/main_api.php',
};

// TODO: 실제 운영 값으로 교체
const RAW_PARAMS = {
  user_id: 'demo', // 필수
  cluster_code: '040403', // 필수 (예시)
  date_type: 'today', // 필수: today | day | week | month | month6 | year
  // start_date: '2025-09-01', // 선택
  // end_date: '2025-09-05'
};

// ====== 유틸 ======
function setStatus(message, type = 'info') {
  const el = document.getElementById('rawDataStatus');
  if (!el) return;
  const color =
    type === 'ok'
      ? '#1a7f37'
      : type === 'warn'
      ? '#b58100'
      : type === 'err'
      ? '#b42318'
      : '#6b7280';
  el.textContent = message;
  el.style.color = color;
}

// ====== API 호출 ======
async function fetchMainData() {
  const url = RAW_API.proxy; // PHP 프록시 사용

  const body = new URLSearchParams();
  Object.entries(RAW_PARAMS).forEach(([k, v]) => body.append(k, v));

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
    body,
  }).catch((e) => {
    console.error('[fetch error]', e);
    throw new Error('프록시 연결 실패: ' + e.message);
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error('[http error]', res.status, text?.slice?.(0, 300));
    throw new Error('HTTP ' + res.status);
  }

  // JSON 파싱 방어
  const rawText = await res.text();
  try {
    return JSON.parse(rawText);
  } catch (e) {
    console.error('[json parse error]', e, rawText?.slice?.(0, 300));
    throw new Error(
      'Invalid JSON response (first 300 chars logged in console)'
    );
  }
}

// ====== 테이블 렌더 ======
function renderTable(items = []) {
  const tbody = document.getElementById('rawDataTbody');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!Array.isArray(items) || items.length === 0) {
    setStatus(
      'PHP 프록시를 통한 API 연결 성공, 그러나 표시할 데이터가 없습니다. (items: 0)',
      'warn'
    );
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 15; // 컬럼 수 변경
    td.style.textAlign = 'center';
    td.style.opacity = '0.8';
    td.textContent = '데이터가 없습니다.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  // 가스 값에 따른 색상 반환 함수
  function getGasColor(value) {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) return '#000000'; // 기본 검정색
    if (numValue <= 1) return '#0066FF'; // 파랑
    if (numValue <= 2) return '#FFB800'; // 노랑
    if (numValue <= 3) return '#FF0000'; // 빨강
    return '#000000'; // 3 초과는 기본 검정색
  }

  const fragment = document.createDocumentFragment();
  items.forEach((it, index) => {
    const tr = document.createElement('tr');
    const c = (v) => v ?? '-';
    
    // 번호
    const tdNum = document.createElement('td');
    tdNum.textContent = index + 1;
    tr.appendChild(tdNum);
    
    // 농장코드
    const tdFarmcode = document.createElement('td');
    tdFarmcode.textContent = c(it.farmcode);
    tr.appendChild(tdFarmcode);
    
    // 농장명
    const tdFarmname = document.createElement('td');
    tdFarmname.textContent = c(it.farmname);
    tr.appendChild(tdFarmname);
    
    // 설치위치
    const tdFarmsub = document.createElement('td');
    tdFarmsub.textContent = c(it.farmsub);
    tr.appendChild(tdFarmsub);
    
    // NH3 (gas1) - 색상 적용
    const tdGas1 = document.createElement('td');
    tdGas1.textContent = c(it.gas1);
    tdGas1.style.color = getGasColor(it.gas1);
    tdGas1.style.fontWeight = '600';
    tr.appendChild(tdGas1);
    
    // H2S (gas2) - 색상 적용
    const tdGas2 = document.createElement('td');
    tdGas2.textContent = c(it.gas2);
    tdGas2.style.color = getGasColor(it.gas2);
    tdGas2.style.fontWeight = '600';
    tr.appendChild(tdGas2);
    
    // CO2 (gas3) - 색상 적용
    const tdGas3 = document.createElement('td');
    tdGas3.textContent = c(it.gas3);
    tdGas3.style.color = getGasColor(it.gas3);
    tdGas3.style.fontWeight = '600';
    tr.appendChild(tdGas3);
    
    // CH4 (gas4)
    const tdGas4 = document.createElement('td');
    tdGas4.textContent = c(it.gas4);
    tr.appendChild(tdGas4);
    
    // 온도
    const tdTemp = document.createElement('td');
    tdTemp.textContent = c(it.temp);
    tr.appendChild(tdTemp);
    
    // 습도
    const tdHumid = document.createElement('td');
    tdHumid.textContent = c(it.humid);
    tr.appendChild(tdHumid);
    
    // 풍향 (API에서 제공하는 필드명 확인 필요)
    const tdWindDir = document.createElement('td');
    tdWindDir.textContent = c(it.wind_direction || it.winddir || it.wind_dir);
    tr.appendChild(tdWindDir);
    
    // 풍속
    const tdWindSpeed = document.createElement('td');
    tdWindSpeed.textContent = c(it.wind_speed || it.windspeed || it.wind);
    tr.appendChild(tdWindSpeed);
    
    // 미세먼지
    const tdDust = document.createElement('td');
    tdDust.textContent = c(it.dust || it.pm25 || it.pm);
    tr.appendChild(tdDust);
    
    // 대기압
    const tdPressure = document.createElement('td');
    tdPressure.textContent = c(it.pressure || it.press);
    tr.appendChild(tdPressure);
    
    // 수신시각
    const tdTimestamp = document.createElement('td');
    tdTimestamp.textContent = c(it.timestamp || it.datetime || it.regdate);
    tr.appendChild(tdTimestamp);
    
    fragment.appendChild(tr);
  });

  tbody.appendChild(fragment);
  setStatus(
    `PHP 프록시를 통한 API 연결 성공, ${items.length}건의 데이터가 로드되었습니다.`,
    'ok'
  );
}

// ====== 초기화 ======
async function initRawDataTable() {
  try {
    setStatus('API에 연결 중입니다...');
    const data = await fetchMainData();

    // 매뉴얼 구조: { success, message, items: [...] }
    // (API 스펙은 /test/ 문서 참고)
    // PHP 프록시 응답도 처리
    if (data && data.success && Array.isArray(data.items)) {
      renderTable(data.items);
    } else if (data && data.success && data.proxy_status) {
      // 프록시를 통한 연결은 성공했지만 데이터가 없는 경우
      setStatus(
        `PHP 프록시 연결 성공 (${data.proxy_status}) - ` + 
        (data.message || '데이터가 없거나 형식이 다릅니다.'),
        data.raw_response ? 'ok' : 'warn'
      );
      renderTable([]);
    } else {
      setStatus(
        'API 응답은 받았지만 형식이 예상과 다릅니다. (success=false 또는 items 미존재)',
        'warn'
      );
      renderTable([]);
    }
  } catch (err) {
    console.error(err);
    setStatus(
      'PHP 프록시 연결 실패: ' +
        (err?.message || 'unknown error') +
        ' — PHP 서버가 실행 중인지 확인해주세요.',
      'err'
    );

    const tbody = document.getElementById('rawDataTbody');
    if (tbody) {
      tbody.innerHTML = '';
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 15; // 컬럼 수 변경
      td.style.textAlign = 'center';
      td.style.opacity = '0.8';
      td.textContent = 'API 연결에 실패했습니다.';
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  }
}
