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
  // 클릭 시 페이지 이동 및 active 처리
  li.addEventListener('click', function () {
    document
      .querySelectorAll('.navList ul li')
      .forEach((el) => el.classList.remove('active'));
    li.classList.add('active');
    window.location.href = li.getAttribute('data-href');
  });
});
$('.navList ul li').on('click', function () {
  $('.navList ul li').removeClass('active');
  $(this).addClass('active');
});

// 로그아웃 버튼
document
  .querySelector('.navFooter_Logout')
  .addEventListener('click', function () {
    window.location.href = 'loginIndex.html';
  });
