import { getTopAnimes, getNewestAnimes } from "../api/jikan.js";

// const listContainer = document.getElementById("anime-list-items");

// function clearList() {
//   listContainer.innerHTML = "";
// }

function renderEmpty(message = "No results.", containerSelector) {
  const listContainer = document.querySelector(containerSelector);
  if (!listContainer) return;

  listContainer.innerHTML = "";
  const li = document.createElement("li");
  li.textContent = message;
  listContainer.appendChild(li);
}

function renderAnimes(animes, containerSelector) {
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
    title.className = "anime-name";
    title.textContent = anime.title;

    li.appendChild(img);
    li.appendChild(title);
    frag.appendChild(li);
  });

  listContainer.appendChild(frag);
}

async function loadTopAnime({ limit = 10, page = 1 } = {}) {
  const controller = new AbortController();
  try {
    const animes = await getTopAnimes({ limit, page, signal: controller.signal });
    console.log(animes);
    renderAnimes(animes, "#popular-anime-list");
  } catch (err) {
    if (err.name === "AbortError") {
        console.log(err);
    } else {
      renderEmpty("Failed to load anime.", "#popular-anime-list");
      console.error(err);
    }
  } finally {
    controller = null;
  }
}

async function loadNewestAnimes({ limit = 10, page = 1} = {}) {
  const controller = new AbortController();
  try {
    const animes = await getNewestAnimes({ limit, page, signal: controller.signal });
    renderAnimes(animes, "#newest-anime-list");
  } catch (err) {
    if (err.name === "AbortError") {
        console.log(err);
    } else {
      renderEmpty("Failed to load anime.", "#newest-anime-list");
      console.error(err);
    }
  } finally {
    controller = null;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTopAnime({ limit: 10, page: 1 });
  loadNewestAnimes({ limit: 10, page: 1 });
});