/**
 * 네비게이션 메뉴 토글 기능
 * #navContainer::after 요소 클릭 시 .navContainer 클래스 변경
 */

document.addEventListener('DOMContentLoaded', function() {
    // nav.html이 로드될 때까지 기다리기 위한 함수
    function waitForNavContainer() {
        const navContainer = document.querySelector('.navContainer');
        
        if (navContainer) {
            setupNavToggle();
        } else {
            // nav.html이 아직 로드되지 않았으면 잠시 후 다시 시도
            setTimeout(waitForNavContainer, 100);
        }
    }
    
    function setupNavToggle() {
        const navContainer = document.querySelector('.navContainer');
        const navContainerParent = document.querySelector('#navContainer');
        
        if (!navContainer || !navContainerParent) return;
        
        // navContainerParent 클릭 이벤트 (::after 요소 클릭 감지)
        navContainerParent.addEventListener('click', function(event) {
            // 세로 방향에서만 동작
            if (window.innerWidth > window.innerHeight) return;
            
            // ::after 요소 영역 확인 
            const clickX = event.clientX;
            const clickY = event.clientY;
            
            // 메뉴 상태에 따른 ::after 요소 위치 계산
            const isMenuOpen = navContainerParent.classList.contains('menu-open');
            const afterLeft = isMenuOpen ? window.innerWidth * 0.4 : 0;
            const afterTop = window.innerHeight - (window.innerHeight * 0.1) - 80;
            const afterRight = afterLeft + 60;
            const afterBottom = window.innerHeight - (window.innerHeight * 0.1);
            
            // 클릭이 ::after 요소 영역 안에 있는지 확인
            if (clickX >= afterLeft && clickX <= afterRight && 
                clickY >= afterTop && clickY <= afterBottom) {
                
                console.log('::after 영역 클릭 감지');
                
                // .navContainer 클래스 토글
                if (navContainer.classList.contains('close')) {
                    navContainer.classList.remove('close');
                    navContainer.classList.add('open');
                    navContainerParent.classList.add('menu-open');
                    console.log('메뉴 열림');
                } else if (navContainer.classList.contains('open')) {
                    navContainer.classList.remove('open');
                    navContainer.classList.add('close');
                    navContainerParent.classList.remove('menu-open');
                    console.log('메뉴 닫힘');
                } else {
                    // 기본 상태에서는 open으로
                    navContainer.classList.add('open');
                    navContainerParent.classList.add('menu-open');
                    console.log('메뉴 열림 (기본상태에서)');
                }
            }
        });
        
        console.log('네비게이션 토글 기능 활성화됨');
    }
    
    // nav.html 로드 대기
    waitForNavContainer();
});
