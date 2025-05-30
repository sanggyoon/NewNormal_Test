// 백엔드 서버 API URL
const API_BASE_URL =
  'https://port-0-newnormal-test2-am952nltb8106p.sel5.cloudtype.app/api/data';

// 데이터 가져오기
async function fetchData() {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);

    const tableBody = document.querySelector('#locationTable tbody');
    tableBody.innerHTML = '';

    data.forEach((item) => {
      const row = document.createElement('tr');

      const idCell = document.createElement('td');
      idCell.textContent = item.location_ID;

      const latitudeCell = document.createElement('td');
      latitudeCell.textContent = item.latitude;

      const longitudeCell = document.createElement('td');
      longitudeCell.textContent = item.longitude;

      row.appendChild(idCell);
      row.appendChild(latitudeCell);
      row.appendChild(longitudeCell);

      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('데이터를 가져오는 중 문제가 발생했습니다. 다시 시도해주세요.');
  }
}

// 데이터 추가
async function addData(event) {
  event.preventDefault();
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;

  if (!latitude || !longitude) {
    alert('위도와 경도를 입력해주세요.');
    return;
  }
  if (isNaN(latitude) || isNaN(longitude)) {
    alert('위도와 경도는 숫자여야 합니다.');
    return;
  }

  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (response.ok) {
      alert('데이터가 성공적으로 추가되었습니다!');
      fetchData();
      document.getElementById('latitude').value = '';
      document.getElementById('longitude').value = '';
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error adding data:', error);
  }
}

//데이터 삭제
async function deleteData(event) {
  event.preventDefault();
  const id = document.getElementById('deleteId').value;
  if (!confirm(`ID ${id} 데이터를 삭제하시겠습니까?`)) {
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      alert(`ID ${id} 데이터가 성공적으로 삭제되었습니다!`);
      fetchData();
      document.getElementById('deleteId').value = '';
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

// 데이터 수정
async function updateData(event) {
  event.preventDefault();
  const id = document.getElementById('updateId').value;
  const latitude = document.getElementById('updateLatitude').value;
  const longitude = document.getElementById('updateLongitude').value;

  if (!id || !latitude || !longitude) {
    alert('ID, 위도, 경도를 모두 입력해주세요.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ latitude, longitude }),
    });

    if (response.ok) {
      alert(`ID ${id} 데이터가 성공적으로 수정되었습니다!`);
      fetchData();
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  fetchData();
  document.getElementById('locationForm').addEventListener('submit', addData);
  document.getElementById('deleteForm').addEventListener('submit', deleteData);
  document.getElementById('updateForm').addEventListener('submit', updateData);
});
