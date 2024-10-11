const music = document.querySelector('#music');
const plusVolume = document.querySelector('.plus-volume');
const minusVolume = document.querySelector('.minus-volume');
const musicToggle = document.querySelector('.music-toggle');
const allBtns = document.querySelectorAll('.click');
const musicMenu = document.querySelector('.open-music-menu');
const controls = document.querySelectorAll('.music-controls');
const btnClickSound = document.querySelector('#button-click');

function initMusic() {
  let volume = 5;
  music.volume = volume / 10;

  const updateVolume = (change) => {
    volume = Math.min(10, Math.max(1, volume + change));
    music.volume = volume / 10;
  };

  plusVolume.addEventListener('click', () => updateVolume(1));
  minusVolume.addEventListener('click', () => updateVolume(-1));

  const togglePlayPause = () => {
    if (music.paused) {
      music.play();
      document.querySelector('.play').style.display = 'none';
      document.querySelector('.pause').style.display = 'flex';
    } else {
      music.pause();
      document.querySelector('.pause').style.display = 'none';
      document.querySelector('.play').style.display = 'flex';
    }
  };

  musicToggle.addEventListener('click', togglePlayPause);

  function clickBtn() {
    btnClickSound.play();
  }

  allBtns.forEach((btn) => {
    btn.addEventListener('click', clickBtn);
  });

  musicMenu.addEventListener('click', () => {
    controls.forEach(control => control.classList.toggle('active'));
  });
}

export {initMusic};