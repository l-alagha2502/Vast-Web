const music = document.querySelector('#background-music');
const clickSound = document.querySelector('#click-sound');
const hoverSound = document.querySelector('#hover-sound');
const musicToggle = document.querySelector('.music-toggle');
const interactiveElements = document.querySelectorAll('.interactive, .badge');

if (music && clickSound && hoverSound && musicToggle) {
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
  window.removeEventListener('pointerdown', startMusic);
  window.removeEventListener('keydown', startMusic);
  window.removeEventListener('wheel', startMusic);
}

music.addEventListener('play', updateMusicButton);
music.addEventListener('pause', updateMusicButton);
musicToggle.addEventListener('click', () => {
  if (music.paused) startMusic();
  else {
    music.pause();
    musicToggle.textContent = '♪';
    musicToggle.setAttribute('aria-label', 'Play background music');
    musicToggle.setAttribute('aria-pressed', 'false');
  }
});

window.addEventListener('pointerdown', startMusic, { once: true });
window.addEventListener('keydown', startMusic, { once: true });
window.addEventListener('wheel', startMusic, { once: true, passive: true });

interactiveElements.forEach((element) => {
  element.addEventListener('mouseenter', () => playSound(hoverSound));
  element.addEventListener('click', () => playSound(clickSound));
});

// Keep the first profile card and second content card aligned to wheel navigation.
let scrollLock = false;
window.addEventListener('wheel', (event) => {
  if (scrollLock || Math.abs(event.deltaY) < 8) return;
  const panels = [...document.querySelectorAll('.panel')];
  const currentIndex = panels.findIndex((panel) => {
    const distance = Math.abs(panel.getBoundingClientRect().top);
    return distance < window.innerHeight * 0.45;
  });
  const nextIndex = event.deltaY > 0 ? Math.min(currentIndex + 1, panels.length - 1) : Math.max(currentIndex - 1, 0);
  if (nextIndex === currentIndex) return;
  scrollLock = true;
  panels[nextIndex].scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => { scrollLock = false; }, 700);
}, { passive: true });
}
