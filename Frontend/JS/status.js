// 현재시간 표시
function updateCurrentTime() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const timeStr = `${yyyy}/${mm}/${dd} | ${hh}:${min}:${ss}`;
  const el = document.getElementById('currentTime');
  if (el) el.textContent = timeStr;
}

// 페이지 로드 후 1초마다 시간 갱신
updateCurrentTime();
setInterval(updateCurrentTime, 1000);

// Date Range Picker 설정
$('#statusBar_choiceDate').daterangepicker(
  {
    locale: {
      format: 'YYYY-MM-DD',
      separator: ' ~ ',
      applyLabel: '확인',
      cancelLabel: '취소',
      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom',
      weekLabel: 'W',
      daysOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
      monthNames: [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월',
      ],
    },
    autoUpdateInput: false,
    startDate: new Date(),
    endDate: new Date(),
    drops: 'auto',
  },
  function (start, end, label) {
    $('#statusBar_choiceDate').val(
      start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD')
    );
  }
);

// 날짜 선택 취소 시 기본 텍스트로 되돌리기
$('#statusBar_choiceDate').on('cancel.daterangepicker', function (ev, picker) {
  $(this).val('날짜 선택 ⏷');
});
