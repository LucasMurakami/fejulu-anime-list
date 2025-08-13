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
    li.classList.add("anime");

    const img = document.createElement("img");
    img.src = anime.image;
    img.alt = `Cover of ${anime.title}`;

    const title = document.createElement("p");
    title.textContent = anime.title;

    li.appendChild(img);
    li.appendChild(title);
    frag.appendChild(li);
  });

  listContainer.appendChild(frag);
}