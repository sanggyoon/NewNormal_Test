function updateLayout() {
  const isPortrait = window.innerHeight > window.innerWidth;
  document.querySelector('.portrait').style.display = isPortrait
    ? 'block'
    : 'none';
  document.querySelector('.landscape').style.display = isPortrait
    ? 'none'
    : 'block';
}

// 최초 로딩 시 실행
updateLayout();

// 화면 크기 또는 방향 변경 시 실행
window.addEventListener('resize', updateLayout);
window.addEventListener('orientationchange', updateLayout);
