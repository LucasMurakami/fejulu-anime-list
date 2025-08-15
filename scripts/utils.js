export function renderEmpty(message = "No results.", containerSelector) {
  const listContainer = document.querySelector(containerSelector);
  if (!listContainer) return;

  listContainer.innerHTML = "";
  const li = document.createElement("li");
  li.textContent = message;
  listContainer.appendChild(li);
}

export function renderAnimes(animes, containerSelector) {
  const listContainer = document.querySelector(containerSelector);
  if (!listContainer) return;

  listContainer.innerHTML = "";

  if (!animes.length) {
    listContainer.innerHTML = "<li class='anime'>Nenhum anime encontrado.</li>";
    return;
  }

  const frag = document.createDocumentFragment();

  animes.forEach(anime => {
    const li = document.createElement("li");
    li.className = "anime";
    li.id = `genre-${anime.id}`;

    const img = document.createElement("img");
    img.src = anime.image;
    img.className = "anime-image"
    img.alt = `Cover of ${anime.title}`;

    const title = document.createElement("p");
    title.className = "anime-name"
    title.textContent = anime.title;

    li.appendChild(img);
    li.appendChild(title);
    frag.appendChild(li);

    // Criação das informações do anime
    const div = document.createElement("div");
    div.className = "anime-pseudo";

    // Direciona para a pagina com as infos do anime
    li.addEventListener("click", () => {
      window.location.href = `infoDesktop.html?id=${anime.id}`;
    });

    const pseudoTitle = document.createElement("p");
    pseudoTitle.className = "anime-pseudo-title";
    pseudoTitle.textContent = anime.title;

    const ratingDiv = document.createElement("div");
    ratingDiv.className = "anime-pseudo-rating-container";

    const scoreDiv = document.createElement("div");
    scoreDiv.className = "anime-pseudo-score-container"

    const score = document.createElement("p");
    score.className = "anime-pseudo-score";
    score.textContent = "✰ " + anime.score;

    const scoreLabel = document.createElement("p");
    scoreLabel.className = "anime-pseudo-score-label";

    if (anime.members < 1_000_000) {
      scoreLabel.textContent = Math.trunc(anime.members / 1000) + "K Users";
    } else {
      scoreLabel.textContent = (anime.members / 1_000_000).toFixed(2) + "M Users";

    }
    scoreLabel.style.fontSize = ".75rem";

    scoreDiv.appendChild(score);
    scoreDiv.appendChild(scoreLabel);

    const popDiv = document.createElement("div");
    popDiv.className = "anime-pseudo-popularity-container"


    const popularity = document.createElement("p");
    popularity.className = "anime-pseudo-popularity";
    popularity.textContent = "# " + anime.popularity;

    const popularityLabel = document.createElement("p");
    popularityLabel.className = "anime-pseudo-popularity-label";
    popularityLabel.textContent = "Popularity";
    popularityLabel.style.fontSize = ".75rem";

    popDiv.appendChild(popularity);
    popDiv.appendChild(popularityLabel);

    div.appendChild(pseudoTitle);

    if (anime.score != null) {
      ratingDiv.appendChild(scoreDiv);
      ratingDiv.appendChild(popDiv);
    } else {
      const toBeReleased = document.createElement("p");
      toBeReleased.textContent = "To be released!";
      toBeReleased.className = "to-be-released";
      div.appendChild(toBeReleased);
    }

    div.appendChild(ratingDiv);
    li.appendChild(div);

  });

  listContainer.appendChild(frag);
}

export function renderAnimesCategories(animesCategory, containerSelector) {
  const listContainer = document.querySelector(containerSelector);
  if (!listContainer) return;

  listContainer.innerHTML = "";

  if (!animesCategory.length) {
    listContainer.innerHTML = "<li class='anime-category'><p class='anime-category-name'>Nenhum anime encontrado.</p></li>";
    return;
  }

  const frag = document.createDocumentFragment();

  animesCategory.forEach(anime => {
    const li = document.createElement("li");
    li.className = "anime-category"
    li.id = `genre-${anime.id}`;
    li.style.cursor = "pointer";

    li.addEventListener("click", () => {
      window.location.href = `category.html?genre=${anime.id}`;
    });

    const title = document.createElement("p");
    title.className = "anime-category-name"
    title.textContent = anime.name;

    li.appendChild(title);
    frag.appendChild(li);
  });

  listContainer.appendChild(frag);
}

export function renderBanner(banners, containerSelector) {
  const listContainer = document.querySelector(containerSelector);
  if (!listContainer) return;

  listContainer.innerHTML = "";

  const frag = document.createDocumentFragment();

  banners.forEach(banner => {
    const li = document.createElement("li");

    li.addEventListener("click", () => {
      window.location.href = banner.info;
    });

    const div = document.createElement("div");
    div.className = "anime-card";
    div.style.backgroundImage = `url(${banner.img})`;
    div.style.backgroundSize = "cover";


    const title = document.createElement("div");
    title.style.backgroundImage = `url(${banner.title})`;
    title.style.backgroundRepeat = "no-repeat";
    title.style.backgroundSize = "contain";
    title.className = "anime-banner-title";

    // const synopsis = document.createElement("p");
    // synopsis.className = "anime-banner-synopsis";
    // synopsis.textContent = banner.synopsis;

    li.appendChild(div)
    div.appendChild(title);
    // div.appendChild(synopsis);
    frag.appendChild(li);
  });

  listContainer.appendChild(frag);
}