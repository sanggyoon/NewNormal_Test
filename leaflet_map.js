// 지도 생성
var map = L.map('map').setView([37.5665, 126.978], 13);

// 타일 레이어 추가
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap contributors',
}).addTo(map);

// 마커 추가
L.marker([36.601028, 127.295891]).addTo(map).bindPopup('조치원역').openPopup();

// 클릭한 위치의 정보 업데이트 함수
function updateInfoPanel(latlng) {
  // 클릭한 위치의 위도와 경도 업데이트
  document.getElementById('latitude').textContent = latlng.lat.toFixed(6);
  document.getElementById('longitude').textContent = latlng.lng.toFixed(6);

  // 클릭한 위치의 주소를 지오코딩을 통해 가져오기
  // fetch(
  //   'https://api.opencagedata.com/geocode/v1/json?q=' +
  //     latlng.lat +
  //     '+' +
  //     latlng.lng +
  //     '&key=YOUR_OPENCAGE_API_KEY'
  // )
  //   .then((response) => response.json())
  //   .then((data) => {
  //     const address = data.results[0].formatted;
  //     document.getElementById('address').textContent = address;
  //   })
  //   .catch((error) => {
  //     console.error('Error fetching address:', error);
  //   });
}
