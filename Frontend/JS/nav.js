// 농장 정보 모달창 토글
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

// navList
document.querySelectorAll('.navList ul li').forEach((li) => {
  // 현재 페이지 active 처리
  if (window.location.pathname.includes(li.getAttribute('data-href'))) {
    li.classList.add('active');
  }
  // 클릭 시 페이지 이동 (active 처리는 다음 페이지에서)
  li.addEventListener('click', function () {
    window.location.href = li.getAttribute('data-href');
  });
});

// 로그아웃 버튼
document
  .querySelector('.navFooter_Logout')
  .addEventListener('click', function () {
    window.location.href = 'loginIndex.html';
  });
