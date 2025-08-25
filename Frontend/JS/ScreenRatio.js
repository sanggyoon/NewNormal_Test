//가로 세로 비율에 따른 렌더링 요소 변경
function updateLayout() {
  const portraitElement = document.querySelector('.portrait');
  const landscapeElement = document.querySelector('.landscape');
  
  if (portraitElement && landscapeElement) {
    const isPortrait = window.innerHeight > window.innerWidth;
    portraitElement.style.display = isPortrait ? 'block' : 'none';
    landscapeElement.style.display = isPortrait ? 'none' : 'block';
  }
}

// 최초 로딩 시 실행
updateLayout();

// 화면 크기 또는 방향 변경 시 실행
window.addEventListener('resize', updateLayout);
window.addEventListener('orientationchange', updateLayout);
