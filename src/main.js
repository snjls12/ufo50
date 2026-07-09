import './style.css';

// ---------------------------------------
//          HELPER FUNCTIONS
// ---------------------------------------

const STORAGE_KEY = 'ufo50_game_statuses';

function loadLocalStatuses() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
}

function saveLocalStatus(gameId, status) {
    const currentStatuses = loadLocalStatuses();
    currentStatuses[gameId] = status;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentStatuses));
}

function updateGameVisuals(gameEl) {
    const gameId = Number(gameEl.dataset.gameId);

    const foreground = document.getElementById(`game-${gameId}-foreground`);
    const background = document.getElementById(`game-${gameId}-background`);

    background.src = `/images/UFO 50 - Dusty Game ${gameId + 1}.png`;
    foreground.src = `/images/UFO 50 - Game ${gameId + 1}.png`;

    switch (gameEl.dataset.status) {
        case 'unfinished':
            foreground.classList.remove('no-crop', 'diagonal-crop');
            foreground.classList.add('full-crop');
            break;

        case 'half-finished':
            foreground.classList.remove('no-crop', 'full-crop');
            foreground.classList.add('diagonal-crop');
            break;

        case 'finished':
            foreground.classList.remove('diagonal-crop', 'full-crop');
            foreground.classList.add('no-crop');
            break;
    }
}

// ---------------------------------------
//          INIT FUNCTIONS
// ---------------------------------------

function getAllStatuses() {
    console.log('Loading local game statuses...');

    const allStatuses = loadLocalStatuses();

    for (const [gameId, status] of Object.entries(allStatuses)) {
        const nextGame = document.getElementById(`game-${gameId}`);

        if (nextGame) {
            nextGame.dataset.status = status;
            updateGameVisuals(nextGame);
        }
    }
}

function initGameElements() {
    const gameGrid = document.querySelector('#all-games-grid');

    for (let i = 0; i < 50; i++) {

        const newGame = document.createElement('div');
        newGame.id = `game-${i}`;
        newGame.classList.add('game-tile');
        newGame.dataset.gameId = i;
        newGame.dataset.status = 'unfinished';
        gameGrid.append(newGame);

        const newBackground = document.createElement('img');
        newBackground.id = `game-${i}-background`;
        newBackground.classList.add('game-background');
        newBackground.draggable = false;
        newGame.append(newBackground);

        const newForeground = document.createElement('img');
        newForeground.id = `game-${i}-foreground`;
        newForeground.classList.add('game-foreground');
        newForeground.draggable = false;
        newGame.append(newForeground);

        updateGameVisuals(newGame);

        newGame.addEventListener('click', function () {

            switch (this.dataset.status) {
                case 'unfinished':
                    this.dataset.status = 'half-finished';
                    break;

                case 'half-finished':
                    this.dataset.status = 'finished';
                    break;

                case 'finished':
                    this.dataset.status = 'unfinished';
                    break;
            }

            updateGameVisuals(this);
            saveLocalStatus(this.dataset.gameId, this.dataset.status);
        });
    }
}

// ---------------------------------------
//          SECRET EASTER EGG
// ---------------------------------------

const easterEggVideos = [
    "https://gitlab.com/chara-dreemur/sans-undertale/-/raw/main/chara.mp4?inline=false",
    "https://gitlab.com/chara-dreemur/sans-undertale/-/raw/main/flippin_le_pancake.mp4?ref_type=heads&inline=false",
];

let lastVideo = -1;

document.getElementById("no-mercy").addEventListener("click", () => {

    let index;

    do {
        index = Math.floor(Math.random() * easterEggVideos.length);
    } while (index === lastVideo && easterEggVideos.length > 1);

    lastVideo = index;

    const overlay = document.createElement("div");
    overlay.id = "easter-egg-overlay";

    overlay.innerHTML = `
        <div id="easter-egg-window">
            <video autoplay controls>
                <source src="${easterEggVideos[index]}" type="video/mp4">
            </video>
        </div>
    `;

    document.documentElement.appendChild(overlay);

    const video = overlay.querySelector("video");

    // Fecha quando o vídeo termina
    video.addEventListener("ended", () => {
        overlay.remove();
    });

    // Fecha clicando fora do vídeo
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            video.pause();
            overlay.remove();
        }
    });
});

// ---------------------------------------
//          RUN APP
// ---------------------------------------

initGameElements();
getAllStatuses();