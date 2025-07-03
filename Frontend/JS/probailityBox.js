// devicePointIndex.html 내에서 컴포넌트 로딩 후 실행
// .atmosphereInfo_dataBox의 높이를 가져와서 .probability_mapBox의 높이로 설정
Promise.all([
  loadComponent('Components/atmosphereBox.html', 'atmosphereInfoBox_id_1'),
  loadComponent('Components/probabilityBox.html', 'probabilityBox'),
]).then(() => {
  const atmosphereBox = document.querySelector('.atmosphereInfo_dataBox');
  const probabilityBoxes = document.querySelectorAll('.probability_mapBox');
  if (atmosphereBox && probabilityBoxes.length > 0) {
    const height = atmosphereBox.offsetHeight;
    probabilityBoxes.forEach((box) => {
      box.style.height = height + 'px';
    });
  }
});
