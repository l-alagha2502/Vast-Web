const music = document.querySelector('#background-music');
const clickSound = document.querySelector('#click-sound');
const hoverSound = document.querySelector('#hover-sound');
const musicToggle = document.querySelector('.music-toggle');
const interactiveElements = document.querySelectorAll('.interactive, .badge');

music.volume = 0.22;
clickSound.volume = 0.34;
hoverSound.volume = 0.22;

function updateMusicButton() {
  const isPlaying = !music.paused;
  musicToggle.textContent = isPlaying ? 'Ⅱ' : '♪';
  musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
  musicToggle.setAttribute('aria-pressed', String(isPlaying));
}

function playSound(audio) {
  audio.currentTime = 0;
  audio.play().catch(() => {});
}

function startMusic() {
  music.play().catch(() => {});
}

music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
musicToggle.addEventListener('pointerdown', (event) => {
  event.stopPropagation();
});

musicToggle.addEventListener('click', () => {
  if (music.paused) startMusic();
  else {
    music.pause();
    musicToggle.textContent = '♪';
    musicToggle.setAttribute('aria-label', 'Play background music');
    musicToggle.setAttribute('aria-pressed', 'false');
  }
});

window.addEventListener('pointerdown', startMusic);
window.addEventListener('keydown', startMusic);
window.addEventListener('wheel', startMusic, { passive: true });

interactiveElements.forEach((element) => {
  element.addEventListener('mouseenter', () => playSound(hoverSound));
  element.addEventListener('click', () => playSound(clickSound));
});

