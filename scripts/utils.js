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
    img.alt = `Cover of ${anime.title}`;

    const title = document.createElement("p");
    title.className = "anime-name"
    title.textContent = anime.title;

    li.appendChild(img);
    li.appendChild(title);
    frag.appendChild(li);
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