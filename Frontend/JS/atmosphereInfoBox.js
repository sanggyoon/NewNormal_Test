function attachAtmosphereModalEvents() {
  document.querySelectorAll('.dataBox_detailButton').forEach(function (btn) {
    btn.onclick = function () {
      const container = btn.closest('.atmosphereInfo_container');
      const modal = container.querySelector('.atmosphereDetailModal');
      if (modal) modal.style.display = 'block';

      const closeBtn = modal.querySelector('.close');
      closeBtn.onclick = function () {
        modal.style.display = 'none';
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = 'none';
        }
      };
    };
  });
}
window.attachAtmosphereModalEvents = attachAtmosphereModalEvents;

function applyDummyDataToAtmosphereBox(index, targetId) {
  const data = DummyData.items[index];
  const container = document.getElementById(targetId);

  if (!container) return;

  // 위치명
  container.querySelector('.atmosphereInfo_locationName span').textContent =
    data.farmsub;

  // 풍향
  container.querySelector('.atmosphere_wind span:nth-child(2)').textContent =
    data.windDirection;

  // 풍속
  container.querySelector('.atmosphere_wind span:nth-child(3)').textContent =
    data.windSpeed;

  // 온도
  container.querySelector(
    '.atmosphere_temperature span:nth-child(2)'
  ).textContent = data.temp;
  // 습도
  container.querySelector(
    '.atmosphere_humidity span:nth-child(2)'
  ).textContent = data.humid;

  // 암모니아
  container.querySelector('.ammoniaBox .gaseousValue').textContent = data.gas1;
  // 황화수소
  container.querySelector('.hydrogenSulfideBox .gaseousValue').textContent =
    data.gas2;
  // 메탄
  container.querySelector('.methaneBox .gaseousValue').textContent = data.gas3;
  // 이산화탄소
  container.querySelector('.carbonDioxideBox .gaseousValue').textContent =
    data.gas4;
}

window.applyAllAtmosphereDummyData = function () {
  applyDummyDataToAtmosphereBox(0, 'atmosphereInfoBox_id_0');
  applyDummyDataToAtmosphereBox(1, 'atmosphereInfoBox_id_1');
  applyDummyDataToAtmosphereBox(2, 'atmosphereInfoBox_id_2');
  applyDummyDataToAtmosphereBox(3, 'atmosphereInfoBox_id_3');
};
