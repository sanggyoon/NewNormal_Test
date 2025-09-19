/**
 * 네비게이션 메뉴 토글 기능
 * #navContainer::after 요소 클릭 시 클래스 변경
 */

document.addEventListener('DOMContentLoaded', function() {
    const navContainer = document.querySelector('#navContainer');
    
    if (!navContainer) return;
    
    // navContainer 클릭 이벤트 (::after 요소 클릭 감지)
    navContainer.addEventListener('click', function(event) {
        // 세로 방향에서만 동작
        if (window.innerWidth > window.innerHeight) return;
        
        // ::after 요소 영역 확인 (화면 하단 좌측 60x80px 영역)
        const rect = navContainer.getBoundingClientRect();
        const clickX = event.clientX;
        const clickY = event.clientY;
        
        // ::after 요소 위치: bottom: 10vh, left: 0, width: 60px, height: 80px
        const afterLeft = 0;
        const afterTop = window.innerHeight - (window.innerHeight * 0.1) - 80; // bottom: 10vh에서 height: 80px 빼기
        const afterRight = 60;
        const afterBottom = window.innerHeight - (window.innerHeight * 0.1);
        
        // 클릭이 ::after 요소 영역 안에 있는지 확인
        if (clickX >= afterLeft && clickX <= afterRight && 
            clickY >= afterTop && clickY <= afterBottom) {
            
            // 클래스 토글
            if (navContainer.classList.contains('close')) {
                navContainer.classList.remove('close');
                navContainer.classList.add('open');
            } else if (navContainer.classList.contains('open')) {
                navContainer.classList.remove('open');
                navContainer.classList.add('close');
            } else {
                // 기본 상태에서는 open으로
                navContainer.classList.add('open');
            }
        }
    });
});
