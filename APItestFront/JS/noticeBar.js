// 공지사항이 3초마다 자연스럽게 위로 슬라이드되며 다음 공지로 넘어가는 애니메이션

document.addEventListener('DOMContentLoaded', function () {
  runNoticeBarAnimation();
});

function runNoticeBarAnimation() {
  const noticeList = document.querySelector('.noticeBar_list ul');
  if (!noticeList) return; // noticeBar가 아직 로드되지 않았으면 종료
  const notices = noticeList.querySelectorAll('li');
  let currentIndex = 0;

  // li 초기 스타일 설정
  notices.forEach((li, idx) => {
    li.style.position = 'absolute';
    li.style.left = 0;
    li.style.top = 0;
    li.style.width = '100%';
    li.style.transition = 'transform 0.5s, opacity 0.5s';
    li.style.transform = idx === 0 ? 'translateY(0)' : 'translateY(100%)';
    li.style.opacity = idx === 0 ? '1' : '0';
  });

  setInterval(() => {
    const prevIndex = currentIndex;
    currentIndex = (currentIndex + 1) % notices.length;

    // 이전 공지 슬라이드 아웃
    notices[prevIndex].style.transform = 'translateY(-100%)';
    notices[prevIndex].style.opacity = '0';

    // 다음 공지 슬라이드 인
    notices[currentIndex].style.transform = 'translateY(0)';
    notices[currentIndex].style.opacity = '1';

    // 이전 공지를 아래로 이동(다음에 다시 올라올 수 있도록)
    setTimeout(() => {
      notices[prevIndex].style.transform = 'translateY(100%)';
    }, 500);
  }, 3000);
}
