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
    td.colSpan = 9;
    td.style.textAlign = 'center';
    td.style.opacity = '0.8';
    td.textContent = '데이터가 없습니다.';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((it) => {
    const tr = document.createElement('tr');
    const c = (v) => v ?? '-';
    [
      c(it.farmcode),
      c(it.farmname),
      c(it.farmsub),
      c(it.gas1),
      c(it.gas2),
      c(it.gas3),
      c(it.gas4),
      c(it.temp),
      c(it.humid),
    ].forEach((text) => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
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
      td.colSpan = 9;
      td.style.textAlign = 'center';
      td.style.opacity = '0.8';
      td.textContent = 'API 연결에 실패했습니다.';
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
  }
}
