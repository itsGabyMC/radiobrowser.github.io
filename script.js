const apiBase = "https://de1.api.radio-browser.info/json/stations/search?country=Argentina";
const resultsList = document.getElementById('resultsList');
const playerBar = document.getElementById('playerBar');
const radioName = document.getElementById('radioName');
const radioLogo = document.getElementById('radioLogo');
const playPauseBtn = document.getElementById('playPauseBtn');
const audioPlayer = document.getElementById('audioPlayer');
const volumeSlider = document.getElementById('volumeSlider');
const bottomText = document.getElementById('bottomText');

let currentStreamUrl = null;

function searchRadios() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    fetch(`${apiBase}&name=${encodeURIComponent(query)}&limit=20`)
        .then(res => res.json())
        .then(data => {
            resultsList.innerHTML = '';
            if (data.length === 0) {
                resultsList.innerHTML = '<li class="list-group-item text-bg-dark">No se encontraron radios.</li>';
                return;
            }
            data.forEach(station => {
                const li = document.createElement('li');
                li.className = 'list-group-item list-group-item-action d-flex align-items-center gap-3';

                const img = document.createElement('img');
                img.src = station.favicon || 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Logo-de-World-Hits-Radio.png';
                img.alt = `${station.name} logo`;
                img.style.width = '40px';
                img.style.height = '40px';
                img.style.borderRadius = '6px';
                img.style.objectFit = 'cover';

                const textSpan = document.createElement('span');
                textSpan.textContent = station.name;

                li.appendChild(img);
                li.appendChild(textSpan);

                li.onclick = () => playStation(station);
                resultsList.appendChild(li);
            });
        });
}

function playStation(station) {
    currentStreamUrl = station.url_resolved;
    audioPlayer.pause();
    audioPlayer.src = currentStreamUrl;
    audioPlayer.load();
    audioPlayer.play().catch(err => console.error("Error al reproducir:", err));
    radioName.textContent = station.name;
    radioLogo.src = station.favicon || 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Logo-de-World-Hits-Radio.png';
    playerBar.style.display = 'flex';
    bottomText.classList.add('player-active');
}

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.src = currentStreamUrl;
        audioPlayer.load();
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
        playerBar.style.display = 'flex';
        bottomText.classList.add('player-active');
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '▶️';
        playerBar.style.display = 'none';
        bottomText.classList.remove('player-active');
    }
}

volumeSlider.addEventListener('input', () => {
    audioPlayer.volume = volumeSlider.value;
});

document.onkeydown = function (e) {
    e = e || window.event;
    switch (e.which || e.keyCode) {
        case 13:
            searchRadios();
            break;
    }
};
