document.getElementById('houseInfoBox').onclick = function () {
  document.getElementById('houseInfoModal').style.display = 'block';
};
document.getElementById('closeModal').onclick = function () {
  document.getElementById('houseInfoModal').style.display = 'none';
};

// 모달 바깥 클릭 시 닫기
window.onclick = function (event) {
  if (event.target == document.getElementById('houseInfoModal')) {
    document.getElementById('houseInfoModal').style.display = 'none';
  }
};
