// 지도 생성
var map = L.map('map').setView([37.5665, 126.978], 13);

// 타일 레이어 추가
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// 열 지도 데이터 초기화
var heatData = mockData.map((data) => [data.lat, data.lng, data.value]);

// 열 지도 레이어 추가
var heat = L.heatLayer(heatData, {
  radius: 40,
  blur: 25,
  maxZoom: 17,
  gradient: {
    0.3: 'blue',
    0.5: 'cyan',
    0.7: 'lime',
    0.9: 'yellow',
    1.0: 'red',
  },
}).addTo(map);

// 전역 변수로 마커 관리
var currentMarker = null;

// 마우스 클릭 이벤트 추가
map.on('click', function (e) {
  // 클릭한 위치의 좌표
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;

  // 클릭한 위치와 mockData의 각 위치 간 거리 계산
  var clickedPoint = L.latLng(lat, lng);
  var closestData = null;
  var minDistance = Infinity;

  mockData.forEach((data) => {
    var dataPoint = L.latLng(data.lat, data.lng);
    var distance = clickedPoint.distanceTo(dataPoint); // 거리 계산 (미터 단위)

    // 가장 가까운 mockData를 찾음
    if (distance < minDistance) {
      minDistance = distance;
      closestData = data;
    }
  });

  // 거리 기반으로 value 감소 (1km당 value 감소)
  var maxDistance = 10000; // 최대 거리 (10km)
  var adjustedValue = Math.max(
    0,
    closestData.value - Math.floor(minDistance / 100)
  );

  // 기존 마커 제거
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // 새로운 마커 추가
  currentMarker = L.marker([lat, lng]).addTo(map);

  // 마커에 팝업 추가 (value 값 표시)
  currentMarker.bindPopup(`Value: ${adjustedValue}`).openPopup();

  // 히트맵 업데이트
  heat.setLatLngs(heatData);
});
