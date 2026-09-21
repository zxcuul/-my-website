const audio = document.getElementById("audio");

const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const progress = document.getElementById("progress");
const volume = document.getElementById("volume");

const musicTitle = document.getElementById("musicTitle");
const musicCounter = document.getElementById("musicCounter");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const playlistItems = document.getElementById("playlistItems");


/* ==========================================
   ТВОИ ПЕСНИ
========================================== */

const playlist = [
  {
    title: "Track 01",
    file: "song1.mp2.mp3"
  },
  {
    title: "Track 02",
    file: "song1.mp3.mp3"
  },
  {
    title: "Track 03",
    file: "song2.mp3.m4a"
  },
  {
    title: "Track 04",
    file: "song4.mp4.mp3"
  }
];


let currentTrack = 0;


/* ==========================================
   ВРЕМЯ
========================================== */

function formatTime(seconds) {

  if (!isFinite(seconds)) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${secs}`;
}


/* ==========================================
   PLAYLIST
========================================== */

function createPlaylist() {

  playlistItems.innerHTML = "";

  playlist.forEach((track, index) => {

    const item = document.createElement("div");

    item.className = "playlist-item";

    item.innerHTML = `
      <span class="playlist-number">
        ${String(index + 1).padStart(2, "0")}
      </span>

      <span class="playlist-name">
        ${track.title}
      </span>
    `;

    item.addEventListener("click", () => {

      loadTrack(index);

      playMusic();

    });

    playlistItems.appendChild(item);

  });

}


/* ==========================================
   ЗАГРУЗКА ТРЕКА
========================================== */

function loadTrack(index) {

  if (!playlist.length) {
    return;
  }

  currentTrack = index;

  const track = playlist[currentTrack];

  audio.src = track.file;

  audio.load();

  musicTitle.textContent = track.title;

  musicCounter.textContent =
    `${currentTrack + 1} / ${playlist.length}`;

  progress.value = 0;

  currentTime.textContent = "0:00";

  duration.textContent = "0:00";

  updateActiveTrack();

}


/* ==========================================
   АКТИВНЫЙ ТРЕК
========================================== */

function updateActiveTrack() {

  const items =
    document.querySelectorAll(".playlist-item");

  items.forEach((item, index) => {

    item.classList.toggle(
      "active",
      index === currentTrack
    );

  });

}


/* ==========================================
   PLAY
========================================== */

function playMusic() {

  audio.play()
    .then(() => {

      playBtn.textContent = "⏸";

    })
    .catch(() => {

      playBtn.textContent = "▶";

    });

}


/* ==========================================
   PAUSE
========================================== */

function pauseMusic() {

  audio.pause();

  playBtn.textContent = "▶";

}


/* ==========================================
   PLAY / PAUSE
========================================== */

playBtn.addEventListener("click", () => {

  if (audio.paused) {

    playMusic();

  } else {

    pauseMusic();

  }

});


/* ==========================================
   НАЗАД
========================================== */

prevBtn.addEventListener("click", () => {

  currentTrack--;

  if (currentTrack < 0) {

    currentTrack = playlist.length - 1;

  }

  loadTrack(currentTrack);

  playMusic();

});


/* ==========================================
   ВПЕРЁД
========================================== */

nextBtn.addEventListener("click", () => {

  currentTrack++;

  if (currentTrack >= playlist.length) {

    currentTrack = 0;

  }

  loadTrack(currentTrack);

  playMusic();

});


/* ==========================================
   АВТОМАТИЧЕСКИ СЛЕДУЮЩАЯ ПЕСНЯ
========================================== */

audio.addEventListener("ended", () => {

  currentTrack++;

  if (currentTrack >= playlist.length) {

    currentTrack = 0;

  }

  loadTrack(currentTrack);

  playMusic();

});


/* ==========================================
   ПРОГРЕСС
========================================== */

audio.addEventListener("timeupdate", () => {

  if (!audio.duration) {
    return;
  }

  const percent =
    (audio.currentTime / audio.duration) * 100;

  progress.value = percent;

  currentTime.textContent =
    formatTime(audio.currentTime);

});


/* ==========================================
   ДЛИТЕЛЬНОСТЬ
========================================== */

audio.addEventListener("loadedmetadata", () => {

  duration.textContent =
    formatTime(audio.duration);

});


/* ==========================================
   ПЕРЕМЕЩЕНИЕ ПО ПЕСНЕ
========================================== */

progress.addEventListener("input", () => {

  if (!audio.duration) {
    return;
  }

  audio.currentTime =
    (progress.value / 100) *
    audio.duration;

});


/* ==========================================
   ГРОМКОСТЬ
========================================== */

volume.addEventListener("input", () => {

  audio.volume = volume.value;

});


/* ==========================================
   НАЧАЛЬНАЯ ГРОМКОСТЬ
========================================== */

audio.volume = 0.8;


/* ==========================================
   ЗАПУСК
========================================== */

createPlaylist();

loadTrack(0);
