let allGames = [];
let currentGames = [];


async function loadGames() {
  try {
    const response = await fetch('games.json');
    const data = await response.json();
    allGames = data.games;
    currentGames = [...allGames];
    renderGames(currentGames); card.addEventListener('click', () => {
        window.location.href = `details.html?title=${encodeURIComponent(game.title)}`;
    });
    initFilters();
  } catch (error) {
    console.error('Error loading games:', error);
    gamesGrid.innerHTML = '<p class="error">Failed to load games. Please try again later.</p>';
  }
}


function initFilters() {
  const genres = [...new Set(allGames.map(game => game.genre))];
  const genreFilter = document.createElement('div');
  genreFilter.className = 'genre-filter';
  genreFilter.innerHTML = `
    <span>Genre:</span>
    <div class="genre-tags">
      <button class="genre-tag active" data-genre="all">All</button>
      ${genres.map(genre => `
        <button class="genre-tag" data-genre="${genre.toLowerCase()}">${genre}</button>
      `).join('')}
    </div>
  `;
  document.querySelector('.filter-options').appendChild(genreFilter);
  
  document.querySelectorAll('.genre-tag').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.genre-tag.active').forEach(t => t.classList.remove('active'));
      button.classList.add('active');
      applyFilters();
    });
  });
}


function applyFilters() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const platform = document.querySelector('.platform-tag.active').dataset.platform;
  const genre = document.querySelector('.genre-tag.active').dataset.genre;

  currentGames = allGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm) ||
                          game.description.toLowerCase().includes(searchTerm);
    const matchesPlatform = platform === 'all' || game.platforms.includes(platform);
    const matchesGenre = genre === 'all' || game.genre.toLowerCase() === genre;
    
    return matchesSearch && matchesPlatform && matchesGenre;
  });

  renderGames(currentGames);
}

document.getElementById('searchInput').addEventListener('input', applyFilters);
document.querySelectorAll('.platform-tag').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.platform-tag.active').classList.remove('active');
    button.classList.add('active');
    applyFilters();
  });
});

loadGames();